import Historico_cargas from "../models/Historico_cargas.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
import Logger from "../db/logger.js";

export default class HistoricoCargasController {

    static async create(req, res) {

        const {
            peso,
            treino_exercicios_id
        } = req.body;

        if (!peso) {
            return res.status(422).json({
                message: "O peso é obrigatório!"
            });
        }

        if (!treino_exercicios_id) {
            return res.status(422).json({
                message: "Selecione um exercício do treino!"
            });
        }

        try {

            const treinoExercicio =
                await Treino_exercicios.findByPk(
                    treino_exercicios_id
                );

            if (!treinoExercicio) {
                return res.status(404).json({
                    message: "Treino/Exercício não encontrado!"
                });
            }

            await Historico_cargas.create({
                peso,
                treino_exercicios_id,
                data_inicial: new Date()
            });

            return res.status(200).json({
                message: "Carga registrada com sucesso!"
            });

        } catch (error) {

            Logger.error(
                `Erro ao registrar carga: ${error}`
            );

            return res.status(500).json({
                message: "Erro ao registrar carga!"
            });
        }
    }
}