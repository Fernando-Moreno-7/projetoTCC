import Treino_exercicios from "../models/Treino_exercicios.js";
import Historico_cargas from "../models/Historico_cargas.js";
import Exercicios from "../models/Exercicios.js";
import Treinos from "../models/Treinos.js";
import Agenda_treinos from "../models/Agenda_treinos.js";
import Logger from "../db/logger.js";
import { Op } from "sequelize";

// Valida IDs, séries e repetições como inteiros positivos.
function inteiroPositivo(valor) {
    if (
        typeof valor !== "string" &&
        typeof valor !== "number"
    ) {
        return false;
    }

    return Number.isSafeInteger(Number(valor)) && Number(valor) > 0;
}

// Confere a identificação adicionada pelo middleware JWT.
function verificarSessao(req, res) {
    if (!req.usuario || !inteiroPositivo(req.usuario.id)) {
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

// Operações de alteração são exclusivas do personal.
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

export default class TreinoExercicioController {

    // Adicionar exercício ao treino: somente personal.
    static async add(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const {
            treino_id,
            exercicio_id,
            series,
            repeticoes
        } = req.body || {};

        if (
            !inteiroPositivo(treino_id) ||
            !inteiroPositivo(exercicio_id)
        ) {
            return res.status(422).json({
                message: "Informe um treino e um exercício válidos!"
            });
        }

        if (
            !inteiroPositivo(series) ||
            !inteiroPositivo(repeticoes)
        ) {
            return res.status(422).json({
                message:
                    "Séries e repetições devem ser números inteiros maiores que zero!"
            });
        }

        try {
            const treino = await Treinos.findByPk(Number(treino_id));

            if (!treino) {
                return res.status(404).json({
                    message: "Treino não encontrado!"
                });
            }

            const exercicio = await Exercicios.findByPk(
                Number(exercicio_id)
            );

            if (!exercicio) {
                return res.status(404).json({
                    message: "Exercício não encontrado!"
                });
            }

            const exercicioJaAdicionado =
                await Treino_exercicios.findOne({
                    where: {
                        treino_id: treino.id,
                        exercicio_id: exercicio.id
                    }
                });

            if (exercicioJaAdicionado) {
                return res.status(409).json({
                    message:
                        "Este exercício já foi adicionado ao treino!"
                });
            }

            await Treino_exercicios.create({
                treino_id: treino.id,
                exercicio_id: exercicio.id,
                series: Number(series),
                repeticoes: Number(repeticoes)
            });

            return res.status(201).json({
                message:
                    "Exercício adicionado ao treino com sucesso!"
            });

        } catch (error) {
            Logger.error(
                `Erro ao adicionar exercício ao treino: ${error}`
            );

            return res.status(500).json({
                message: "Erro ao adicionar exercício ao treino!"
            });
        }
    }

    // Listar exercícios dos treinos autorizados.
    static async list(req, res) {
        if (!verificarSessao(req, res)) {
            return;
        }

        const treinoIdInformado = req.query.treino_id;
        const possuiFiltro = treinoIdInformado !== undefined;

        if (
            possuiFiltro &&
            !inteiroPositivo(treinoIdInformado)
        ) {
            return res.status(422).json({
                message: "Informe um ID de treino válido!"
            });
        }

        try {
            const where = {};

            if (req.usuario.tipo_usuario === "aluno") {
                // A identidade do aluno vem da sessão autenticada.
                const agendamentos = await Agenda_treinos.findAll({
                    where: {
                        usuario_id: Number(req.usuario.id)
                    },
                    attributes: ["treino_id"],
                    raw: true
                });

                const idsTreinos = [
                    ...new Set(
                        agendamentos.map((item) => item.treino_id)
                    )
                ];

                if (idsTreinos.length === 0) {
                    return res.status(200).json([]);
                }

                // Sempre limita aos treinos do aluno.
                where.treino_id = {
                    [Op.in]: idsTreinos
                };

                // Se houver filtro, aplica as duas condições.
                if (possuiFiltro) {
                    where.treino_id[Op.eq] =
                        Number(treinoIdInformado);
                }

            } else if (possuiFiltro) {
                // Personal pode consultar qualquer treino.
                where.treino_id = Number(treinoIdInformado);
            }

            const treinoExercicios =
                await Treino_exercicios.findAll({
                    where,
                    include: [
                        {
                            model: Exercicios,
                            attributes: [
                                "id",
                                "nome",
                                "grupo_muscular",
                                "imagem",
                                "descricao"
                            ]
                        }
                    ],
                    order: [
                        ["id", "ASC"]
                    ]
                });

            return res.status(200).json(treinoExercicios);

        } catch (error) {
            Logger.error(
                `Erro ao listar exercícios do treino: ${error}`
            );

            return res.status(500).json({
                message: "Erro ao listar exercícios do treino!"
            });
        }
    }

    // Atualizar séries e repetições: somente personal.
    static async update(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const { id, series, repeticoes } = req.body || {};

        if (!inteiroPositivo(id)) {
            return res.status(422).json({
                message: "Informe um ID de registro válido!"
            });
        }

        if (
            !inteiroPositivo(series) ||
            !inteiroPositivo(repeticoes)
        ) {
            return res.status(422).json({
                message:
                    "Séries e repetições devem ser números inteiros maiores que zero!"
            });
        }

        try {
            const treinoExercicio =
                await Treino_exercicios.findByPk(Number(id));

            if (!treinoExercicio) {
                return res.status(404).json({
                    message: "Registro não encontrado!"
                });
            }

            await treinoExercicio.update({
                series: Number(series),
                repeticoes: Number(repeticoes)
            });

            return res.status(200).json({
                message: "Registro atualizado com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao atualizar registro: ${error}`);

            return res.status(500).json({
                message: "Erro ao atualizar registro!"
            });
        }
    }

    // Remover exercício do treino: somente personal.
    static async delete(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const { id } = req.body || {};

        if (!inteiroPositivo(id)) {
            return res.status(422).json({
                message: "Informe um ID de registro válido!"
            });
        }

        try {
            // Exclui o histórico e o vínculo na mesma transação.
            const excluido =
                await Treino_exercicios.sequelize.transaction(
                    async (transaction) => {
                        const treinoExercicio =
                            await Treino_exercicios.findByPk(
                                Number(id),
                                { transaction }
                            );

                        if (!treinoExercicio) {
                            return false;
                        }

                        await Historico_cargas.destroy({
                            where: {
                                treino_exercicios_id: treinoExercicio.id
                            },
                            transaction
                        });

                        await treinoExercicio.destroy({
                            transaction
                        });

                        return true;
                    }
                );

            if (!excluido) {
                return res.status(404).json({
                    message: "Registro não encontrado!"
                });
            }

            return res.status(200).json({
                message:
                    "Exercício removido do treino com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao excluir registro: ${error}`);

            return res.status(500).json({
                message: "Erro ao remover exercício do treino!"
            });
        }
    }
}