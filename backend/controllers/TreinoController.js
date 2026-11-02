import Treinos from "../models/Treinos.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
import Historico_cargas from "../models/Historico_cargas.js";
import Agenda_treinos from "../models/Agenda_treinos.js";
import Exercicios from "../models/Exercicios.js";
import Logger from "../db/logger.js";
import { Op } from "sequelize";

// Valida IDs recebidos nas requisições.
function idValido(valor) {
    if (
        typeof valor !== "string" &&
        typeof valor !== "number"
    ) {
        return false;
    }

    return Number.isSafeInteger(Number(valor)) && Number(valor) > 0;
}

// Verifica a identificação adicionada pelo middleware JWT.
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

// Restringe as operações administrativas ao personal.
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

// Valida os campos usados no cadastro e na atualização.
function validarDados(body, res) {
    const { nome, descricao } = body || {};

    if (typeof nome !== "string" || !nome.trim()) {
        res.status(422).json({
            message: "O nome do treino é obrigatório!"
        });
        return null;
    }

    if (
        descricao !== undefined &&
        descricao !== null &&
        typeof descricao !== "string"
    ) {
        res.status(422).json({
            message: "A descrição deve ser um texto!"
        });
        return null;
    }

    return {
        nome: nome.trim(),
        descricao: descricao?.trim() || ""
    };
}

// Busca os IDs dos treinos vinculados ao aluno autenticado.
async function buscarIdsDosTreinosDoAluno(usuarioId) {
    const agendamentos = await Agenda_treinos.findAll({
        where: {
            usuario_id: usuarioId
        },
        attributes: ["treino_id"],
        raw: true
    });

    return [
        ...new Set(
            agendamentos.map((item) => item.treino_id)
        )
    ];
}

export default class TreinoController {

    // Criar treino: somente personal.
    static async createTreino(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const dados = validarDados(req.body, res);

        if (!dados) {
            return;
        }

        try {
            const treino = await Treinos.create(dados);

            return res.status(201).json({
                message: "Treino cadastrado com sucesso!",
                treinoId: treino.id
            });

        } catch (error) {
            Logger.error(`Erro ao criar treino: ${error}`);

            return res.status(500).json({
                message: "Erro ao criar treino!"
            });
        }
    }

    // Personal consulta todos.
    // Aluno consulta somente os vinculados à própria agenda.
    static async getAllTreinos(req, res) {
        if (!verificarSessao(req, res)) {
            return;
        }

        try {
            const where = {};

            if (req.usuario.tipo_usuario === "aluno") {
                const ids = await buscarIdsDosTreinosDoAluno(
                    Number(req.usuario.id)
                );

                if (ids.length === 0) {
                    return res.status(200).json([]);
                }

                where.id = {
                    [Op.in]: ids
                };
            }

            const treinos = await Treinos.findAll({
                where,
                include: [
                    {
                        model: Treino_exercicios,
                        attributes: [
                            "id",
                            "series",
                            "repeticoes",
                            "exercicio_id"
                        ],
                        include: [
                            {
                                model: Exercicios,
                                attributes: [
                                    "id",
                                    "nome",
                                    "grupo_muscular"
                                ]
                            }
                        ]
                    }
                ],
                order: [
                    ["nome", "ASC"]
                ]
            });

            return res.status(200).json(treinos);

        } catch (error) {
            Logger.error(`Erro ao buscar treinos: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar treinos!"
            });
        }
    }

    // Buscar um treino respeitando o vínculo com o aluno.
    static async getTreinoById(req, res) {
        if (!verificarSessao(req, res)) {
            return;
        }

        const idTreino = req.params.id;

        if (!idValido(idTreino)) {
            return res.status(422).json({
                message: "Informe um ID de treino válido!"
            });
        }

        try {
            const where = {
                id: Number(idTreino)
            };

            if (req.usuario.tipo_usuario === "aluno") {
                const ids = await buscarIdsDosTreinosDoAluno(
                    Number(req.usuario.id)
                );

                if (ids.length === 0) {
                    return res.status(404).json({
                        message: "Treino não encontrado!"
                    });
                }

                // A própria consulta exige que o treino solicitado
                // esteja entre os treinos do aluno autenticado.
                where.id = {
                    [Op.eq]: Number(idTreino),
                    [Op.in]: ids
                };
            }

            const treino = await Treinos.findOne({
                where
            });

            if (!treino) {
                return res.status(404).json({
                    message: "Treino não encontrado!"
                });
            }

            return res.status(200).json(treino);

        } catch (error) {
            Logger.error(`Erro ao buscar treino: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar treino!"
            });
        }
    }

    // Atualizar treino: somente personal.
    static async updateTreino(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const { idTreino } = req.body || {};

        if (!idValido(idTreino)) {
            return res.status(422).json({
                message: "Selecione um treino válido!"
            });
        }

        const dados = validarDados(req.body, res);

        if (!dados) {
            return;
        }

        try {
            const treino = await Treinos.findByPk(Number(idTreino));

            if (!treino) {
                return res.status(404).json({
                    message: "Treino não encontrado!"
                });
            }

            await treino.update(dados);

            return res.status(200).json({
                message: "Treino atualizado com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao atualizar treino: ${error}`);

            return res.status(500).json({
                message: "Erro ao atualizar treino!"
            });
        }
    }

    // Excluir treino e dependências: somente personal.
    static async deleteTreino(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const { idTreino } = req.body || {};

        if (!idValido(idTreino)) {
            return res.status(422).json({
                message: "Selecione um treino válido!"
            });
        }

        try {
            // Todas as exclusões são confirmadas juntas.
            // Se alguma falhar, a transação desfaz as anteriores.
            const excluido = await Treinos.sequelize.transaction(
                async (transaction) => {
                    const treino = await Treinos.findByPk(
                        Number(idTreino),
                        { transaction }
                    );

                    if (!treino) {
                        return false;
                    }

                    const treinoExercicios =
                        await Treino_exercicios.findAll({
                            where: {
                                treino_id: treino.id
                            },
                            attributes: ["id"],
                            transaction
                        });

                    const idsTreinoExercicios =
                        treinoExercicios.map((item) => item.id);

                    if (idsTreinoExercicios.length > 0) {
                        await Historico_cargas.destroy({
                            where: {
                                treino_exercicios_id: {
                                    [Op.in]: idsTreinoExercicios
                                }
                            },
                            transaction
                        });
                    }

                    await Treino_exercicios.destroy({
                        where: {
                            treino_id: treino.id
                        },
                        transaction
                    });

                    await Agenda_treinos.destroy({
                        where: {
                            treino_id: treino.id
                        },
                        transaction
                    });

                    await treino.destroy({
                        transaction
                    });

                    return true;
                }
            );

            if (!excluido) {
                return res.status(404).json({
                    message: "Treino não encontrado!"
                });
            }

            return res.status(200).json({
                message: "Treino excluído com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao excluir treino: ${error}`);

            return res.status(500).json({
                message: "Erro ao excluir treino!"
            });
        }
    }
}