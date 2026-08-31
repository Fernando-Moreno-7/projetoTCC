import Exercicios from "../models/Exercicios.js";
import Logger from "../db/logger.js";

export default class ExercicioController {

    static async createExercicio(req, res) {

        // FUNÇÕES DO PERSONAL

        const {
            nome,
            grupo_muscular,
            imagem,
            descricao
        } = req.body;

        if (!nome) {
            return res.status(422).json({
                message: "O nome do exercício é obrigatório!"
            });
        }

        if (!grupo_muscular) {
            return res.status(422).json({
                message: "O grupo muscular é obrigatório!"
            });
        }

        if (!descricao) {
            return res.status(422).json({
                message: "A descrição é obrigatória!"
            });
        }

        try {

            await Exercicios.create({
                nome,
                grupo_muscular,
                imagem: imagem || "",
                descricao
            });

            return res.status(200).json({
                message: "Exercício cadastrado com sucesso!"
            });

        } catch (error) {

            Logger.error(`Erro ao criar exercício: ${error}`);

            return res.status(500).json({
                message: "Erro ao criar exercício!"
            });

        }
    }


    static async getAllExercicios(req, res) {

        // FUNÇÕES DO PERSONAL

        try {

            const exercicios = await Exercicios.findAll();

            return res.status(200).json(exercicios);

        } catch (error) {

            Logger.error(`Erro ao buscar exercícios: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar exercícios!"
            });

        }
    }


    static async getExercicioById(req, res) {

        // FUNÇÕES DO PERSONAL

        const idExercicio = req.params.id;

        try {

            const exercicio = await Exercicios.findByPk(idExercicio);

            if (!exercicio) {
                return res.status(404).json({
                    message: "Exercício não encontrado!"
                });
            }

            return res.status(200).json(exercicio);

        } catch (error) {

            Logger.error(`Erro ao buscar exercício: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar exercício!"
            });

        }
    }


    static async updateExercicio(req, res) {

        // FUNÇÕES DO PERSONAL

        const {
            idExercicio,
            nome,
            grupo_muscular,
            imagem,
            descricao
        } = req.body;

        if (!idExercicio) {
            return res.status(422).json({
                message: "Selecione um exercício!"
            });
        }

        if (!nome) {
            return res.status(422).json({
                message: "O nome do exercício é obrigatório!"
            });
        }

        if (!grupo_muscular) {
            return res.status(422).json({
                message: "O grupo muscular é obrigatório!"
            });
        }

        if (!descricao) {
            return res.status(422).json({
                message: "A descrição é obrigatória!"
            });
        }

        try {

            const exercicio = await Exercicios.findByPk(idExercicio);

            if (!exercicio) {
                return res.status(404).json({
                    message: "Exercício não encontrado!"
                });
            }

            await Exercicios.update(
                {
                    nome,
                    grupo_muscular,
                    imagem: imagem ?? exercicio.imagem ?? "",
                    descricao
                },
                {
                    where: {
                        id: idExercicio
                    }
                }
            );

            return res.status(200).json({
                message: "Exercício atualizado com sucesso!"
            });

        } catch (error) {

            Logger.error(`Erro ao atualizar exercício: ${error}`);

            return res.status(500).json({
                message: "Erro ao atualizar exercício!"
            });

        }
    }


    static async deleteExercicio(req, res) {

        // FUNÇÕES DO PERSONAL

        const idExercicio = req.body.idExercicio;

        if (!idExercicio) {
            return res.status(422).json({
                message: "Selecione um exercício!"
            });
        }

        try {

            const exercicio = await Exercicios.findByPk(idExercicio);

            if (!exercicio) {
                return res.status(404).json({
                    message: "Exercício não encontrado!"
                });
            }

            await Exercicios.destroy({
                where: {
                    id: idExercicio
                }
            });

            return res.status(200).json({
                message: "Exercício excluído com sucesso!"
            });

        } catch (error) {

            Logger.error(`Erro ao excluir exercício: ${error}`);

            return res.status(500).json({
                message: "Erro ao excluir exercício!"
            });

        }
    }
}