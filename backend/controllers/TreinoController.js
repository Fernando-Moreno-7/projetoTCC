// Importa o model de Treinos
import Treinos from "../models/Treinos.js";

// Importa a tabela intermediária que relaciona treinos e exercícios
import Treino_exercicios from "../models/Treino_exercicios.js";

// Importa o histórico de cargas dos exercícios
import Historico_cargas from "../models/Historico_cargas.js";

// Importa a agenda de treinos dos usuários
import Agenda_treinos from "../models/Agenda_treinos.js";

// Importa o model de Exercícios
import Exercicios from "../models/Exercicios.js";

// Importa o Logger para registrar erros
import Logger from "../db/logger.js";

// Importa os operadores do Sequelize
import { Op } from "sequelize";

export default class TreinoController {

    // CRIAR TREINO
    static async createTreino(req, res) {

        // Recebe nome e descrição através do corpo da requisição
        const { nome, descricao } = req.body;

        // Valida se o nome foi informado
        if (!nome || !nome.trim()) {
            return res.status(422).json({
                message: "O nome do treino é obrigatório!"
            });
        }

        try {

            // Cria o treino no banco de dados
            const treino = await Treinos.create({
                // trim() remove espaços do início e do final
                nome: nome.trim(),

                // Se a descrição existir, remove os espaços.
                // Caso contrário, salva uma string vazia
                descricao: descricao?.trim() || ""
            });

            // Retorna sucesso e o ID do treino criado
            return res.status(201).json({
                message: "Treino cadastrado com sucesso!",
                treinoId: treino.id
            });

        } catch (error) {

            // Registra o erro no Logger
            Logger.error(`Erro ao criar treino: ${error}`);

            return res.status(500).json({
                message: "Erro ao criar treino!"
            });
        }
    }


    // LISTAR TODOS OS TREINOS
    static async getAllTreinos(req, res) {

        try {

            // Busca todos os treinos cadastrados
            const treinos = await Treinos.findAll({

                // include traz dados relacionados de outras tabelas
                include: [
                    {
                        // Tabela intermediária entre treinos e exercícios
                        model: Treino_exercicios,

                        // Define quais campos serão retornados
                        attributes: [
                            "id",
                            "series",
                            "repeticoes",
                            "exercicio_id"
                        ],

                        // Busca também os dados dos exercícios relacionados
                        include: [
                            {
                                model: Exercicios,

                                // Campos do exercício que serão retornados
                                attributes: [
                                    "id",
                                    "nome",
                                    "grupo_muscular"
                                ]
                            }
                        ]
                    }
                ],

                // Ordena os treinos pelo nome em ordem crescente
                order: [
                    ["nome", "ASC"]
                ]
            });

            // Retorna os treinos encontrados
            return res.status(200).json(treinos);

        } catch (error) {

            Logger.error(`Erro ao buscar treinos: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar treinos!"
            });
        }
    }


    // BUSCAR TREINO PELO ID
    static async getTreinoById(req, res) {

        // Recebe o ID através dos parâmetros da URL
        const idTreino = req.params.id;

        try {

            // Busca o treino pela chave primária
            const treino = await Treinos.findByPk(idTreino);

            // Verifica se o treino existe
            if (!treino) {
                return res.status(404).json({
                    message: "Treino não encontrado!"
                });
            }

            // Retorna o treino encontrado
            return res.status(200).json(treino);

        } catch (error) {

            Logger.error(`Erro ao buscar treino: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar treino!"
            });
        }
    }


    // ATUALIZAR TREINO
    static async updateTreino(req, res) {

        // Recebe os dados enviados no corpo da requisição
        const { idTreino, nome, descricao } = req.body;

        // Verifica se um treino foi selecionado
        if (!idTreino) {
            return res.status(422).json({
                message: "Selecione um treino!"
            });
        }

        // Verifica se o nome foi informado
        if (!nome || !nome.trim()) {
            return res.status(422).json({
                message: "O nome do treino é obrigatório!"
            });
        }

        try {

            // Busca o treino pela chave primária
            const treino = await Treinos.findByPk(idTreino);

            // Verifica se o treino existe
            if (!treino) {
                return res.status(404).json({
                    message: "Treino não encontrado!"
                });
            }

            // Atualiza os dados do treino
            await Treinos.update(
                {
                    nome: nome.trim(),
                    descricao: descricao?.trim() || ""
                },
                {
                    // Define qual treino será atualizado
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


    // EXCLUIR TREINO
    static async deleteTreino(req, res) {

        // Recebe o ID do treino através do corpo da requisição
        const idTreino = req.body.idTreino;

        // Verifica se um treino foi selecionado
        if (!idTreino) {
            return res.status(422).json({
                message: "Selecione um treino!"
            });
        }

        try {

            // Busca o treino pela chave primária
            const treino = await Treinos.findByPk(idTreino);

            // Verifica se o treino existe
            if (!treino) {
                return res.status(404).json({
                    message: "Treino não encontrado!"
                });
            }


            // Busca as relações entre o treino e seus exercícios
            const treinoExercicios = await Treino_exercicios.findAll({
                where: {
                    treino_id: idTreino
                },

                // Retorna apenas os IDs dessas relações
                attributes: ["id"]
            });


            // Cria uma lista contendo apenas os IDs
            // Exemplo: [{id: 1}, {id: 2}] -> [1, 2]
            const idsTreinoExercicios = treinoExercicios.map(
                (item) => item.id
            );


            // Verifica se existem relações treino/exercício
            if (idsTreinoExercicios.length > 0) {

                // Exclui os históricos de carga relacionados
                await Historico_cargas.destroy({
                    where: {

                        // Op.in verifica se o ID está dentro da lista de IDs
                        treino_exercicios_id: {
                            [Op.in]: idsTreinoExercicios
                        }
                    }
                });
            }


            // Exclui as relações entre o treino e os exercícios
            await Treino_exercicios.destroy({
                where: {
                    treino_id: idTreino
                }
            });


            // Exclui os registros da agenda relacionados ao treino
            await Agenda_treinos.destroy({
                where: {
                    treino_id: idTreino
                }
            });


            // Depois de limpar as dependências,
            // exclui o próprio treino
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