import Agenda_treinos from "../models/Agenda_treinos.js";
import Logger from "../db/logger.js";
import Usuarios from "../models/Usuarios.js";
import Treinos from "../models/Treinos.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
import Exercicios from "../models/Exercicios.js";
import Historico_cargas from "../models/Historico_cargas.js";

// Confere a identificação adicionada pelo middleware JWT.
function verificarSessao(req, res) {
    if (!req.usuario) {
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

// Valida IDs recebidos nas requisições.
function idValido(valor) {
    const numero = Number(valor);
    return Number.isSafeInteger(numero) && numero > 0;
}

// Define qual usuário pode ser consultado.
// Para alunos, a identidade usada vem da sessão autenticada.
function obterUsuarioAutorizado(req, res) {
    if (!verificarSessao(req, res)) {
        return null;
    }

    const usuarioId = Number(req.params.usuario_id);

    if (!idValido(usuarioId)) {
        res.status(422).json({
            message: "Informe um ID de usuário válido!"
        });
        return null;
    }

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

// Inclui a propriedade do registro na própria consulta ao banco.
function filtroAgendamento(req, id) {
    const where = { id: Number(id) };

    if (req.usuario.tipo_usuario === "aluno") {
        where.usuario_id = req.usuario.id;
    }

    return where;
}

export default class AgendaTreinoController {

    // Criar agendamento
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
                status: status || "pendente"
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

    // Listar todos os agendamentos: somente personal
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

    // Buscar agendamento respeitando o proprietário
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

    // Atualizar agendamento: somente personal
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

        if (!status) {
            return res.status(422).json({
                message: "Informe o status do agendamento!"
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

    // Excluir agendamento: somente personal
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

    // Buscar o treino de hoje do usuário autorizado
    static async getTreinoDoUsuario(req, res) {
        const usuarioId = obterUsuarioAutorizado(req, res);

        if (usuarioId === null) {
            return;
        }

        try {
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
                    order: [["data_inicial", "DESC"]]
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

    // Finalizar somente um agendamento autorizado
    static async finalizarTreino(req, res) {
        if (!verificarSessao(req, res)) {
            return;
        }

        const { id } = req.body;

        if (!idValido(id)) {
            return res.status(422).json({
                message: "Informe um ID de agendamento válido!"
            });
        }

        try {
            const where = filtroAgendamento(req, id);

            const agenda = await Agenda_treinos.findOne({
                where
            });

            if (!agenda) {
                return res.status(404).json({
                    message: "Agendamento não encontrado!"
                });
            }

            if (agenda.status === "concluido") {
                return res.status(409).json({
                    message: "Este treino já foi concluído!"
                });
            }

            // Repete a propriedade e o status na atualização.
            // Se o registro mudar entre a consulta e a escrita,
            // a operação não altera o agendamento.
            const [alterados] = await Agenda_treinos.update(
                {
                    status: "concluido"
                },
                {
                    where: {
                        ...where,
                        usuario_id: agenda.usuario_id,
                        status: agenda.status
                    }
                }
            );

            if (alterados === 0) {
                return res.status(409).json({
                    message:
                        "O agendamento foi alterado ou já foi concluído. Atualize a página!"
                });
            }

            return res.status(200).json({
                message: "Treino finalizado com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao finalizar treino: ${error}`);

            return res.status(500).json({
                message: "Erro ao finalizar treino!"
            });
        }
    }

    // Histórico do usuário autorizado
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