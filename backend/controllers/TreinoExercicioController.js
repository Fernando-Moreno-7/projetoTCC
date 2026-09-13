import Treino_exercicios from "../models/Treino_exercicios.js";
import Historico_cargas from "../models/Historico_cargas.js";
import Exercicios from "../models/Exercicios.js";
import Treinos from "../models/Treinos.js";
import Logger from "../db/logger.js";

export default class TreinoExercicioController {

    // =========================================
    // ADICIONAR EXERCÍCIO AO TREINO
    // =========================================

    static async add(req, res) {

        const {
            treino_id,
            exercicio_id,
            series,
            repeticoes
        } = req.body;

        if (
            !treino_id ||
            !exercicio_id ||
            !series ||
            !repeticoes
        ) {
            return res.status(422).json({
                message: "Preencha todos os campos!"
            });
        }

        if (Number(series) <= 0 || Number(repeticoes) <= 0) {
            return res.status(422).json({
                message: "Séries e repetições devem ser maiores que zero!"
            });
        }

        try {

            const treino = await Treinos.findByPk(treino_id);

            if (!treino) {
                return res.status(404).json({
                    message: "Treino não encontrado!"
                });
            }

            const exercicio = await Exercicios.findByPk(exercicio_id);

            if (!exercicio) {
                return res.status(404).json({
                    message: "Exercício não encontrado!"
                });
            }

            // Evita adicionar o mesmo exercício duas vezes
            // no mesmo treino
            const exercicioJaAdicionado =
                await Treino_exercicios.findOne({
                    where: {
                        treino_id,
                        exercicio_id
                    }
                });

            if (exercicioJaAdicionado) {
                return res.status(409).json({
                    message:
                        "Este exercício já foi adicionado ao treino!"
                });
            }

            await Treino_exercicios.create({
                treino_id,
                exercicio_id,
                series,
                repeticoes
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
                message:
                    "Erro ao adicionar exercício ao treino!"
            });
        }
    }

    // =========================================
    // LISTAR EXERCÍCIOS DO TREINO
    // =========================================

    static async list(req, res) {

        const treino_id = req.query.treino_id;

        try {

            const where = {};

            if (treino_id) {
                where.treino_id = treino_id;
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

            return res.status(200).json(
                treinoExercicios
            );

        } catch (error) {

            Logger.error(
                `Erro ao listar exercícios do treino: ${error}`
            );

            return res.status(500).json({
                message:
                    "Erro ao listar exercícios do treino!"
            });
        }
    }

    // =========================================
    // ATUALIZAR SÉRIES E REPETIÇÕES
    // =========================================

    static async update(req, res) {

        const {
            id,
            series,
            repeticoes
        } = req.body;

        if (!id) {
            return res.status(422).json({
                message: "Informe o ID!"
            });
        }

        if (!series || !repeticoes) {
            return res.status(422).json({
                message:
                    "Informe séries e repetições!"
            });
        }

        if (Number(series) <= 0 || Number(repeticoes) <= 0) {
            return res.status(422).json({
                message:
                    "Séries e repetições devem ser maiores que zero!"
            });
        }

        try {

            const treinoExercicio =
                await Treino_exercicios.findByPk(id);

            if (!treinoExercicio) {
                return res.status(404).json({
                    message:
                        "Registro não encontrado!"
                });
            }

            await Treino_exercicios.update(
                {
                    series,
                    repeticoes
                },
                {
                    where: {
                        id
                    }
                }
            );

            return res.status(200).json({
                message:
                    "Registro atualizado com sucesso!"
            });

        } catch (error) {

            Logger.error(
                `Erro ao atualizar registro: ${error}`
            );

            return res.status(500).json({
                message:
                    "Erro ao atualizar registro!"
            });
        }
    }

    // =========================================
    // REMOVER EXERCÍCIO DO TREINO
    // =========================================

    static async delete(req, res) {

        const { id } = req.body;

        if (!id) {
            return res.status(422).json({
                message: "Informe o ID!"
            });
        }

        try {

            const treinoExercicio =
                await Treino_exercicios.findByPk(id);

            if (!treinoExercicio) {
                return res.status(404).json({
                    message:
                        "Registro não encontrado!"
                });
            }

            // Remove os históricos de carga associados
            // antes de remover a relação treino/exercício
            await Historico_cargas.destroy({
                where: {
                    treino_exercicios_id: id
                }
            });

            await Treino_exercicios.destroy({
                where: {
                    id
                }
            });

            return res.status(200).json({
                message:
                    "Exercício removido do treino com sucesso!"
            });

        } catch (error) {

            Logger.error(
                `Erro ao excluir registro: ${error}`
            );

            return res.status(500).json({
                message:
                    "Erro ao remover exercício do treino!"
            });
        }
    }
}