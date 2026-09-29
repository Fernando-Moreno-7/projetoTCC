// Importa o model de Exercícios
import Exercicios from "../models/Exercicios.js";

// Importa a tabela intermediária que relaciona treinos e exercícios
import Treino_exercicios from "../models/Treino_exercicios.js";

// Importa o Logger para registrar erros
import Logger from "../db/logger.js";

export default class ExercicioController {

    // =========================================
    // CADASTRAR EXERCÍCIO
    // =========================================

    static async createExercicio(req, res) {

        // Recebe os dados enviados pelo corpo da requisição
        const {
            nome,
            grupo_muscular,
            imagem,
            descricao
        } = req.body;

        // Valida se o nome foi informado
        if (!nome) {
            return res.status(422).json({
                message: "O nome do exercício é obrigatório!"
            });
        }

        // Valida se o grupo muscular foi informado
        if (!grupo_muscular) {
            return res.status(422).json({
                message: "O grupo muscular é obrigatório!"
            });
        }

        // Valida se a descrição foi informada
        if (!descricao) {
            return res.status(422).json({
                message: "A descrição é obrigatória!"
            });
        }

        try {

            // Cria um novo exercício no banco de dados
            await Exercicios.create({
                nome,
                grupo_muscular,

                // Se nenhuma imagem for informada,
                // salva uma string vazia
                imagem: imagem || "",

                descricao
            });

            // Retorna sucesso após criar o exercício
            return res.status(201).json({
                message: "Exercício cadastrado com sucesso!"
            });

        } catch (error) {

            // Registra o erro no Logger
            Logger.error(
                `Erro ao criar exercício: ${error}`
            );

            return res.status(500).json({
                message: "Erro ao criar exercício!"
            });
        }
    }


    // =========================================
    // LISTAR EXERCÍCIOS
    // =========================================

    static async getAllExercicios(req, res) {

        try {

            // Busca todos os exercícios cadastrados
            const exercicios = await Exercicios.findAll({

                // Ordena os exercícios pelo nome
                // ASC = ordem crescente/alfabética
                order: [
                    ["nome", "ASC"]
                ]
            });

            // Retorna a lista de exercícios
            return res.status(200).json(exercicios);

        } catch (error) {

            Logger.error(
                `Erro ao buscar exercícios: ${error}`
            );

            return res.status(500).json({
                message: "Erro ao buscar exercícios!"
            });
        }
    }


    // =========================================
    // BUSCAR EXERCÍCIO PELO ID
    // =========================================

    static async getExercicioById(req, res) {

        // Recebe o ID através dos parâmetros da URL
        const idExercicio = req.params.id;

        try {

            // Busca o exercício pela chave primária (ID)
            const exercicio =
                await Exercicios.findByPk(idExercicio);

            // Verifica se o exercício foi encontrado
            if (!exercicio) {
                return res.status(404).json({
                    message: "Exercício não encontrado!"
                });
            }

            // Retorna o exercício encontrado
            return res.status(200).json(exercicio);

        } catch (error) {

            Logger.error(
                `Erro ao buscar exercício: ${error}`
            );

            return res.status(500).json({
                message: "Erro ao buscar exercício!"
            });
        }
    }


    // =========================================
    // ATUALIZAR EXERCÍCIO
    // =========================================

    static async updateExercicio(req, res) {

        // Recebe os dados enviados pelo corpo da requisição
        const {
            idExercicio,
            nome,
            grupo_muscular,
            imagem,
            descricao
        } = req.body;

        // Verifica se um exercício foi selecionado
        if (!idExercicio) {
            return res.status(422).json({
                message: "Selecione um exercício!"
            });
        }

        // Valida o nome
        if (!nome) {
            return res.status(422).json({
                message: "O nome do exercício é obrigatório!"
            });
        }

        // Valida o grupo muscular
        if (!grupo_muscular) {
            return res.status(422).json({
                message: "O grupo muscular é obrigatório!"
            });
        }

        // Valida a descrição
        if (!descricao) {
            return res.status(422).json({
                message: "A descrição é obrigatória!"
            });
        }

        try {

            // Busca o exercício pela chave primária
            const exercicio =
                await Exercicios.findByPk(idExercicio);

            // Verifica se o exercício existe
            if (!exercicio) {
                return res.status(404).json({
                    message: "Exercício não encontrado!"
                });
            }

            // Atualiza os dados do exercício
            await Exercicios.update(
                {
                    nome,
                    grupo_muscular,

                    // Usa a nova imagem, se ela existir.
                    // Se for null ou undefined, mantém a imagem antiga.
                    // Se a antiga também não existir, usa uma string vazia.
                    imagem:
                        imagem ??
                        exercicio.imagem ??
                        "",

                    descricao
                },
                {
                    // Define qual exercício será atualizado
                    where: {
                        id: idExercicio
                    }
                }
            );

            return res.status(200).json({
                message: "Exercício atualizado com sucesso!"
            });

        } catch (error) {

            Logger.error(
                `Erro ao atualizar exercício: ${error}`
            );

            return res.status(500).json({
                message: "Erro ao atualizar exercício!"
            });
        }
    }


    // =========================================
    // EXCLUIR EXERCÍCIO
    // =========================================

    static async deleteExercicio(req, res) {

        // Recebe o ID do exercício pelo corpo da requisição
        const idExercicio =
            req.body.idExercicio;

        // Verifica se um exercício foi selecionado
        if (!idExercicio) {
            return res.status(422).json({
                message: "Selecione um exercício!"
            });
        }

        try {

            // Busca o exercício pela chave primária
            const exercicio =
                await Exercicios.findByPk(idExercicio);

            // Verifica se o exercício existe
            if (!exercicio) {
                return res.status(404).json({
                    message: "Exercício não encontrado!"
                });
            }


            // Verifica se existe pelo menos um treino
            // utilizando este exercício
            const exercicioEmTreino =
                await Treino_exercicios.findOne({
                    where: {
                        exercicio_id: idExercicio
                    }
                });


            // Se o exercício estiver relacionado a algum treino,
            // impede a exclusão para preservar os relacionamentos
            if (exercicioEmTreino) {
                return res.status(409).json({
                    message:
                        "Este exercício está sendo utilizado em um treino. Remova-o dos treinos antes de excluí-lo!"
                });
            }


            // Exclui o exercício do banco de dados
            await Exercicios.destroy({
                where: {
                    id: idExercicio
                }
            });


            return res.status(200).json({
                message: "Exercício excluído com sucesso!"
            });

        } catch (error) {

            Logger.error(
                `Erro ao excluir exercício: ${error}`
            );

            return res.status(500).json({
                message: "Erro ao excluir exercício!"
            });
        }
    }
}