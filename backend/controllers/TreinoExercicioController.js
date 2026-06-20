import Treino_exercicios from "../models/Treino_exercicios.js";
import Exercicios from "../models/Exercicios.js";
import Treinos from "../models/Treinos.js";
import Logger from "../db/logger.js";

export default class TreinoExercicioController {

    static async add(req, res) {
        const { treino_id, exercicio_id, series, repeticoes } = req.body;

        if (!treino_id || !exercicio_id || !series || !repeticoes) {
            return res.status(422).json({
                message: "Preencha todos os campos!"
            });
        }

        const treino = await Treinos.findByPk(treino_id);
        const exercicio = await Exercicios.findByPk(exercicio_id);

        if (!treino) {
            return res.status(404).json({
                message: "Treino não encontrado!"
            });
        }

        if (!exercicio) {
            return res.status(404).json({
                message: "Exercício não encontrado!"
            });
        }

        try {
            await Treino_exercicios.create({
                treino_id,
                exercicio_id,
                series,
                repeticoes
            });

            return res.status(200).json({
                message: "Exercício adicionado ao treino com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao adicionar exercício ao treino: ${error}`);

            return res.status(500).json({
                message: "Erro ao adicionar exercício ao treino!"
            });
        }
    }

    static async list(req, res) {
        try {
            const treinoExercicios = await Treino_exercicios.findAll();

            return res.status(200).json(treinoExercicios);

        } catch (error) {
            Logger.error(`Erro ao listar exercícios do treino: ${error}`);

            return res.status(500).json({
                message: "Erro ao listar exercícios do treino!"
            });
        }
    }

    static async update(req, res) {
        const { id, series, repeticoes } = req.body;

        if (!id) {
            return res.status(422).json({
                message: "Informe o ID!"
            });
        }

        try {
            const treinoExercicio = await Treino_exercicios.findByPk(id);

            if (!treinoExercicio) {
                return res.status(404).json({
                    message: "Registro não encontrado!"
                });
            }

            await Treino_exercicios.update(
                {
                    series,
                    repeticoes
                },
                {
                    where: { id }
                }
            );

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

    static async delete(req, res) {
        const { id } = req.body;

        if (!id) {
            return res.status(422).json({
                message: "Informe o ID!"
            });
        }

        try {
            const treinoExercicio = await Treino_exercicios.findByPk(id);

            if (!treinoExercicio) {
                return res.status(404).json({
                    message: "Registro não encontrado!"
                });
            }

            await Treino_exercicios.destroy({
                where: { id }
            });

            return res.status(200).json({
                message: "Registro excluído com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao excluir registro: ${error}`);

            return res.status(500).json({
                message: "Erro ao excluir registro!"
            });
        }
    }
}