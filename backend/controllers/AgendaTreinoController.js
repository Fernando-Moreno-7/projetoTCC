import Agenda_treinos from "../models/Agenda_treinos.js";
import Logger from "../db/logger.js";
import Usuarios from "../models/Usuarios.js";
import Treinos from "../models/Treinos.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
import Exercicios from "../models/Exercicios.js";
import Historico_cargas from "../models/Historico_cargas.js";

// Valida IDs recebidos nas requisições.
function idValido(valor) {
    if (
        typeof valor !== "string" &&
        typeof valor !== "number"
    ) {
        return false;
    }

    const numero = Number(valor);

    return Number.isSafeInteger(numero) && numero > 0;
}

// Confere a identificação adicionada pelo middleware JWT.
function verificarSessao(req, res) {
    if (!req.usuario || !idValido(req.usuario.id)) {
        res.status(401).json({
            message: "Faça login para continuar!"
        });

        return false;
    }

    if (
        req.usuario.tipo_usuario !== "personal" &&
        req.usuario.tipo_usuario !== "aluno"
    ) {
        res.status(403).json({
            message: "Perfil sem permissão de acesso!"
        });

        return false;
    }

    return true;
}

// Operações administrativas são exclusivas do personal.
function verificarPersonal(req, res) {
    if (!verificarSessao(req, res)) {
        return false;
    }

    if (req.usuario.tipo_usuario !== "personal") {
        res.status(403).json({
            message: "Somente o personal pode realizar esta ação!"
        });

        return false;
    }

    return true;
}

// Define qual usuário pode ser consultado.
// Para alunos, a identidade utilizada vem da sessão.
function obterUsuarioAutorizado(req, res) {
    if (!verificarSessao(req, res)) {
        return null;
    }

    const idInformado = req.params.usuario_id;

    if (!idValido(idInformado)) {
        res.status(422).json({
            message: "Informe um ID de usuário válido!"
        });

        return null;
    }

    const usuarioId = Number(idInformado);

    if (req.usuario.tipo_usuario === "personal") {
        return usuarioId;
    }

    if (usuarioId !== Number(req.usuario.id)) {
        res.status(403).json({
            message: "Você não pode acessar os dados de outro usuário!"
        });

        return null;
    }

    return Number(req.usuario.id);
}

// Inclui a propriedade do registro na consulta ao banco.
function filtroAgendamento(req, id) {
    const where = {
        id: Number(id)
    };

    if (req.usuario.tipo_usuario === "aluno") {
        where.usuario_id = Number(req.usuario.id);
    }

    return where;
}

export default class AgendaTreinoController {

    // Criar agendamento: somente personal.
    static async agendar(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const { usuario_id, treino_id, data, status } = req.body;

        if (!idValido(usuario_id) || !idValido(treino_id) || !data) {
            return res.status(422).json({
                message: "Preencha aluno, treino e data corretamente!"
            });
        }

        const statusAgenda = status || "pendente";

        if (!["pendente", "concluido"].includes(statusAgenda)) {
            return res.status(422).json({
                message: "Informe um status de agendamento válido!"
            });
        }

        try {
            const usuario = await Usuarios.findByPk(usuario_id);

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            if (usuario.tipo_usuario !== "aluno") {
                return res.status(422).json({
                    message: "O usuário selecionado não é um aluno!"
                });
            }

            const treino = await Treinos.findByPk(treino_id);

            if (!treino) {
                return res.status(404).json({
                    message: "Treino não encontrado!"
                });
            }

            const agenda = await Agenda_treinos.create({
                usuario_id,
                treino_id,
                data,
                status: statusAgenda
            });

            return res.status(201).json({
                message: "Treino agendado com sucesso!",
                agendaId: agenda.id
            });

        } catch (error) {
            Logger.error(`Erro ao agendar treino: ${error}`);

            return res.status(500).json({
                message: "Erro ao agendar treino!"
            });
        }
    }

    // Listar todos os agendamentos: somente personal.
    static async list(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        try {
            const agenda = await Agenda_treinos.findAll({
                include: [
                    {
                        model: Usuarios,
                        attributes: ["id", "nome", "email"]
                    },
                    {
                        model: Treinos,
                        attributes: ["id", "nome", "descricao"]
                    }
                ],
                order: [
                    ["data", "ASC"],
                    ["id", "ASC"]
                ]
            });

            return res.status(200).json(agenda);

        } catch (error) {
            Logger.error(`Erro ao listar agenda: ${error}`);

            return res.status(500).json({
                message: "Erro ao listar agenda!"
            });
        }
    }

    // Buscar agendamento respeitando o proprietário.
    static async getById(req, res) {
        if (!verificarSessao(req, res)) {
            return;
        }

        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(422).json({
                message: "Informe um ID de agendamento válido!"
            });
        }

        try {
            const agenda = await Agenda_treinos.findOne({
                where: filtroAgendamento(req, id),
                include: [
                    {
                        model: Usuarios,
                        attributes: ["id", "nome", "email"]
                    },
                    {
                        model: Treinos,
                        attributes: ["id", "nome", "descricao"]
                    }
                ]
            });

            if (!agenda) {
                return res.status(404).json({
                    message: "Agendamento não encontrado!"
                });
            }

            return res.status(200).json(agenda);

        } catch (error) {
            Logger.error(`Erro ao buscar agenda: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar agenda!"
            });
        }
    }

    // Atualizar agendamento: somente personal.
    static async update(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const { id, usuario_id, treino_id, data, status } = req.body;

        if (!idValido(id)) {
            return res.status(422).json({
                message: "Informe um ID de agendamento válido!"
            });
        }

        if (!idValido(usuario_id)) {
            return res.status(422).json({
                message: "Selecione um aluno!"
            });
        }

        if (!idValido(treino_id)) {
            return res.status(422).json({
                message: "Selecione um treino!"
            });
        }

        if (!data) {
            return res.status(422).json({
                message: "Informe a data do treino!"
            });
        }

        if (!["pendente", "concluido"].includes(status)) {
            return res.status(422).json({
                message: "Informe um status de agendamento válido!"
            });
        }

        try {
            const agenda = await Agenda_treinos.findByPk(id);

            if (!agenda) {
                return res.status(404).json({
                    message: "Agendamento não encontrado!"
                });
            }

            const usuario = await Usuarios.findByPk(usuario_id);

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            if (usuario.tipo_usuario !== "aluno") {
                return res.status(422).json({
                    message: "O usuário selecionado não é um aluno!"
                });
            }

            const treino = await Treinos.findByPk(treino_id);

            if (!treino) {
                return res.status(404).json({
                    message: "Treino não encontrado!"
                });
            }

            await Agenda_treinos.update(
                { usuario_id, treino_id, data, status },
                { where: { id } }
            );

            return res.status(200).json({
                message: "Agendamento atualizado com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao atualizar agenda: ${error}`);

            return res.status(500).json({
                message: "Erro ao atualizar agenda!"
            });
        }
    }

    // Excluir agendamento: somente personal.
    static async delete(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const { id } = req.body;

        if (!idValido(id)) {
            return res.status(422).json({
                message: "Informe um ID de agendamento válido!"
            });
        }

        try {
            const removidos = await Agenda_treinos.destroy({
                where: { id }
            });

            if (!removidos) {
                return res.status(404).json({
                    message: "Agendamento não encontrado!"
                });
            }

            return res.status(200).json({
                message: "Agendamento removido com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao remover agenda: ${error}`);

            return res.status(500).json({
                message: "Erro ao remover agenda!"
            });
        }
    }

    // Buscar o treino de hoje do usuário autorizado.
    static async getTreinoDoUsuario(req, res) {
        const usuarioId = obterUsuarioAutorizado(req, res);

        if (usuarioId === null) {
            return;
        }

        try {
            // Usa a data local do servidor.
            const hoje = new Date();
            const ano = hoje.getFullYear();
            const mes = String(hoje.getMonth() + 1).padStart(2, "0");
            const dia = String(hoje.getDate()).padStart(2, "0");
            const dataHoje = `${ano}-${mes}-${dia}`;

            const agenda = await Agenda_treinos.findOne({
                where: {
                    usuario_id: usuarioId,
                    data: dataHoje
                },
                order: [["id", "DESC"]]
            });

            if (!agenda) {
                return res.status(404).json({
                    message: "Você não possui treino agendado para hoje!"
                });
            }

            // O treino continua visível depois de concluído.
            const treino = await Treinos.findByPk(agenda.treino_id);

            if (!treino) {
                return res.status(404).json({
                    message: "Treino não encontrado!"
                });
            }

            const itens = await Treino_exercicios.findAll({
                where: {
                    treino_id: treino.id
                },
                include: [
                    {
                        model: Exercicios
                    }
                ],
                order: [["id", "ASC"]]
            });

            const exercicios = [];

            for (const item of itens) {
                const ultimaCarga = await Historico_cargas.findOne({
                    where: {
                        treino_exercicios_id: item.id,
                        usuario_id: usuarioId
                    },
                    order: [
                        ["data_inicial", "DESC"],
                        ["id", "DESC"]
                    ]
                });

                exercicios.push({
                    id: item.id,
                    exercicio_id: item.exercicio.id,
                    nome: item.exercicio.nome,
                    grupo_muscular: item.exercicio.grupo_muscular,
                    imagem: item.exercicio.imagem,
                    descricao: item.exercicio.descricao,
                    series: item.series,
                    repeticoes: item.repeticoes,
                    ultima_carga: ultimaCarga ? ultimaCarga.peso : null
                });
            }

            return res.status(200).json({
                agenda,
                treino,
                exercicios
            });

        } catch (error) {
            Logger.error(`Erro ao buscar treino do usuário: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar treino do usuário!"
            });
        }
    }

    // Salvar cargas e concluir o agendamento na mesma transação.
    static async finalizarTreino(req, res) {
        if (!verificarSessao(req, res)) {
            return;
        }

        const { id, cargas } = req.body;

        if (!idValido(id)) {
            return res.status(422).json({
                message: "Informe um ID de agendamento válido!"
            });
        }

        // Lançar um erro interrompe a transação.
        function interromper(status, message) {
            const error = new Error(message);
            error.statusHttp = status;
            throw error;
        }

        try {
            await Agenda_treinos.sequelize.transaction(
                async (transaction) => {
                    // Bloqueia o agendamento até o fim da transação.
                    // Duas finalizações não podem gravar ao mesmo tempo.
                    const agenda = await Agenda_treinos.findOne({
                        where: filtroAgendamento(req, id),
                        transaction,
                        lock: transaction.LOCK.UPDATE
                    });

                    if (!agenda) {
                        interromper(
                            404,
                            "Agendamento não encontrado!"
                        );
                    }

                    if (agenda.status === "concluido") {
                        interromper(
                            409,
                            "Este treino já foi concluído!"
                        );
                    }

                    if (agenda.status !== "pendente") {
                        interromper(
                            409,
                            "O agendamento não está pendente!"
                        );
                    }

                    if (!Array.isArray(cargas) || cargas.length === 0) {
                        interromper(
                            422,
                            "Informe pelo menos uma carga!"
                        );
                    }

                    // Busca os exercícios do treino agendado.
                    const itens = await Treino_exercicios.findAll({
                        where: {
                            treino_id: agenda.treino_id
                        },
                        attributes: ["id"],
                        transaction,
                        lock: transaction.LOCK.SHARE
                    });

                    const idsPermitidos = new Set(
                        itens.map((item) => Number(item.id))
                    );

                    const idsRecebidos = new Set();
                    const registros = [];

                    // Valida todos os itens antes de salvar.
                    for (const carga of cargas) {
                        if (
                            !carga ||
                            typeof carga !== "object" ||
                            Array.isArray(carga) ||
                            !idValido(carga.treino_exercicios_id)
                        ) {
                            interromper(
                                422,
                                "Informe um exercício do treino válido!"
                            );
                        }

                        const itemId = Number(
                            carga.treino_exercicios_id
                        );

                        if (!idsPermitidos.has(itemId)) {
                            interromper(
                                422,
                                "Um dos exercícios não pertence ao treino agendado!"
                            );
                        }

                        if (idsRecebidos.has(itemId)) {
                            interromper(
                                422,
                                "Não envie cargas repetidas para o mesmo exercício!"
                            );
                        }

                        const peso = Number(carga.peso);

                        // A coluna peso utiliza INT no MySQL.
                        if (
                            !["string", "number"].includes(
                                typeof carga.peso
                            ) ||
                            !Number.isSafeInteger(peso) ||
                            peso <= 0 ||
                            peso > 2147483647
                        ) {
                            interromper(
                                422,
                                "Informe cargas inteiras maiores que zero!"
                            );
                        }

                        idsRecebidos.add(itemId);

                        registros.push({
                            peso,
                            treino_exercicios_id: itemId,

                            // O usuário vem do agendamento autorizado.
                            usuario_id: agenda.usuario_id
                        });
                    }

                    // Salva as cargas dentro da transação.
                    await Historico_cargas.bulkCreate(registros, {
                        transaction,
                        validate: true
                    });
                    // Conclui o agendamento na mesma transação.
                    await agenda.update(
                        { status: "concluido" },
                        { transaction }
                    );

                    // Ao terminar sem erros, o Sequelize faz o commit.
                    // Se ocorrer um erro, ele desfaz as alterações.
                }
            );

            // Só informa sucesso depois do commit.
            return res.status(200).json({
                message: "Treino finalizado com sucesso!"
            });

        } catch (error) {
            if (error.statusHttp) {
                return res.status(error.statusHttp).json({
                    message: error.message
                });
            }

            Logger.error(`Erro ao finalizar treino: ${error}`);

            return res.status(500).json({
                message: "Erro ao finalizar treino!"
            });
        }
    }

    // Histórico do usuário autorizado.
    static async historico(req, res) {
        const usuarioId = obterUsuarioAutorizado(req, res);

        if (usuarioId === null) {
            return;
        }

        try {
            const historico = await Agenda_treinos.findAll({
                where: {
                    usuario_id: usuarioId,
                    status: "concluido"
                },
                include: [
                    {
                        model: Treinos,
                        attributes: ["id", "nome", "descricao"]
                    }
                ],
                order: [
                    ["data", "DESC"],
                    ["id", "DESC"]
                ]
            });

            return res.status(200).json(historico);

        } catch (error) {
            Logger.error(`Erro ao buscar histórico: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar histórico!"
            });
        }
    }
}