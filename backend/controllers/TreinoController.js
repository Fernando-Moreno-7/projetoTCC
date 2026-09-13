import Treinos from "../models/Treinos.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
import Historico_cargas from "../models/Historico_cargas.js";
import Agenda_treinos from "../models/Agenda_treinos.js";
import Exercicios from "../models/Exercicios.js";
import Logger from "../db/logger.js";
import { Op } from "sequelize";

export default class TreinoController {

    static async createTreino(req, res) {

        const { nome, descricao } = req.body;

        if (!nome || !nome.trim()) {
            return res.status(422).json({
                message: "O nome do treino é obrigatório!"
            });
        }

        try {

            const treino = await Treinos.create({
                nome: nome.trim(),
                descricao: descricao?.trim() || ""
            });

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

    static async getAllTreinos(req, res) {

        try {

            const treinos = await Treinos.findAll({
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

    static async getTreinoById(req, res) {

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

        const {
            idTreino,
            nome,
            descricao
        } = req.body;

        if (!idTreino) {
            return res.status(422).json({
                message: "Selecione um treino!"
            });
        }

        if (!nome || !nome.trim()) {
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
                    nome: nome.trim(),
                    descricao: descricao?.trim() || ""
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
                        treino_exercicios_id: {
                            [Op.in]: idsTreinoExercicios
                        }
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