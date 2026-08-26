import Treinos from "../models/Treinos.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
import Historico_cargas from "../models/Historico_cargas.js";
import Agenda_treinos from "../models/Agenda_treinos.js";

import Logger from "../db/logger.js";

export default class TreinoController {

    static async createTreino(req, res) {

        // FUNÇÕES DO PERSONAL

        const { nome, descricao } = req.body;

        if (!nome) {

            return res.status(422).json({
                message: "O nome do treino é obrigatório!"
            });

        }

        try {

            await Treinos.create({
                nome,
                descricao
            });

            return res.status(200).json({
                message: "Treino cadastrado com sucesso!"
            });

        } catch (error) {

            Logger.error(`Erro ao criar treino: ${error}`);

            return res.status(500).json({
                message: "Erro ao criar treino!"
            });

        }

    }

    static async getAllTreinos(req, res) {

        // FUNÇÕES DO PERSONAL

        try {

            const treinos = await Treinos.findAll();

            return res.status(200).json(treinos);

        } catch (error) {

            Logger.error(`Erro ao buscar treinos: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar treinos!"
            });

        }

    }

    static async getTreinoById(req, res) {

        // FUNÇÕES DO PERSONAL

        const idTreino = req.params.id;

        try {

            const treino = await Treinos.findByPk(idTreino);

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

    static async updateTreino(req, res) {

        // FUNÇÕES DO PERSONAL

        const idTreino = req.body.idTreino;
        const nome = req.body.nome;
        const descricao = req.body.descricao;

        if (!idTreino) {

            return res.status(422).json({
                message: "Selecione um treino!"
            });

        }

        if (!nome) {

            return res.status(422).json({
                message: "O nome do treino é obrigatório!"
            });

        }

        try {

            const treino = await Treinos.findByPk(idTreino);

            if (!treino) {

                return res.status(404).json({
                    message: "Treino não encontrado!"
                });

            }

            await Treinos.update(
                {
                    nome,
                    descricao
                },
                {
                    where: {
                        id: idTreino
                    }
                }
            );

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

    static async deleteTreino(req, res) {

        // FUNÇÕES DO PERSONAL

        const idTreino = req.body.idTreino;

        if (!idTreino) {

            return res.status(422).json({
                message: "Selecione um treino!"
            });

        }

        try {

            const treino = await Treinos.findByPk(idTreino);

            if (!treino) {

                return res.status(404).json({
                    message: "Treino não encontrado!"
                });

            }

            const treinoExercicios = await Treino_exercicios.findAll({
                where: {
                    treino_id: idTreino
                },
                attributes: ["id"]
            });

            const idsTreinoExercicios = treinoExercicios.map(
                (item) => item.id
            );

            if (idsTreinoExercicios.length > 0) {

                await Historico_cargas.destroy({
                    where: {
                        treino_exercicios_id: idsTreinoExercicios
                    }
                });

            }

            await Treino_exercicios.destroy({
                where: {
                    treino_id: idTreino
                }
            });

            await Agenda_treinos.destroy({
                where: {
                    treino_id: idTreino
                }
            });

            await Treinos.destroy({
                where: {
                    id: idTreino
                }
            });

            return res.status(200).json({
                message: "Treino excluído com sucesso!"
            });

        } catch (error) {

            Logger.error(`Erro ao excluir treino: ${error}`);

            return res.status(500).json({
                message: "Erro ao excluir treino!",
                error: error.message
            });

        }

    }

}