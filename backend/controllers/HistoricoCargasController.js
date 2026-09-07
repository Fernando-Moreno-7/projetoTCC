import Historico_cargas from "../models/Historico_cargas.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
import Usuarios from "../models/Usuarios.js";
import Logger from "../db/logger.js";


export default class HistoricoCargasController {

    static async create(req, res) {

        const {
            peso,
            treino_exercicios_id,
            usuario_id
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


        if (!usuario_id) {
            return res.status(422).json({
                message: "O usuário é obrigatório!"
            });
        }


        try {

            const usuario =
                await Usuarios.findByPk(usuario_id);


            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }


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
                usuario_id,
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


    static async getHistoricoPorExercicio(req, res) {

        const { id } = req.params;
        const { usuario_id } = req.query;


        if (!usuario_id) {
            return res.status(422).json({
                message: "O usuário é obrigatório!"
            });
        }


        try {

            const treinoExercicio =
                await Treino_exercicios.findByPk(id);


            if (!treinoExercicio) {
                return res.status(404).json({
                    message: "Treino/Exercício não encontrado!"
                });
            }


            const historico =
                await Historico_cargas.findAll({
                    where: {
                        treino_exercicios_id: id,
                        usuario_id
                    },

                    attributes: [
                        "id",
                        "peso",
                        "data_inicial"
                    ],

                    order: [
                        ["data_inicial", "ASC"]
                    ]
                });


            return res.status(200).json(
                historico
            );


        } catch (error) {

            Logger.error(
                `Erro ao buscar histórico de cargas: ${error}`
            );


            return res.status(500).json({
                message: "Erro ao buscar histórico de cargas!"
            });

        }

    }


    static async getHistoricoPorUsuario(req, res) {

        const { usuario_id } = req.params;


        try {

            const usuario =
                await Usuarios.findByPk(usuario_id);


            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }


            const historico =
                await Historico_cargas.findAll({
                    where: {
                        usuario_id
                    },

                    include: [
                        {
                            model: Treino_exercicios,
                            attributes: [
                                "id",
                                "exercicio_id",
                                "treino_id"
                            ]
                        }
                    ],

                    order: [
                        ["data_inicial", "ASC"]
                    ]
                });


            return res.status(200).json(
                historico
            );


        } catch (error) {

            Logger.error(
                `Erro ao buscar histórico do usuário: ${error}`
            );


            return res.status(500).json({
                message: "Erro ao buscar histórico do usuário!"
            });

        }

    }

}