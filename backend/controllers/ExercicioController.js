import Exercicios from "../models/Exercicios.js";
import Logger from "../db/logger.js";

export default class ExercicioController {
static async createExercicio(req, res) {

    const { nome, grupo_muscular, imagem, descricao } = req.body;

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

    if (!imagem) {
        return res.status(422).json({
            message: "A imagem é obrigatória!"
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
            imagem,
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
         console.log(req.body);

    const idExercicio = req.body.idExercicio;
    const nome = req.body.nome;
    const grupo_muscular = req.body.grupo_muscular;
    const imagem = req.body.imagem;
    const descricao = req.body.descricao;

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

    if (!imagem) {
        return res.status(422).json({
            message: "A imagem é obrigatória!"
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
                imagem,
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