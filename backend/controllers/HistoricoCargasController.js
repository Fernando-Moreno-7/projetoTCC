// Importa o model responsável pelo histórico de cargas
import Historico_cargas from "../models/Historico_cargas.js";

// Importa a tabela intermediária que relaciona treinos e exercícios
import Treino_exercicios from "../models/Treino_exercicios.js";

// Importa o model de usuários
import Usuarios from "../models/Usuarios.js";

// Importa o Logger para registrar erros da aplicação
import Logger from "../db/logger.js";


export default class HistoricoCargasController {

    // =========================================
    // REGISTRAR UMA NOVA CARGA
    // =========================================
    static async create(req, res) {

        // Recebe os dados enviados no corpo da requisição
        const {
            peso,
            treino_exercicios_id,
            usuario_id
        } = req.body;


        // Valida se o peso foi informado
        if (!peso) {
            return res.status(422).json({
                message: "O peso é obrigatório!"
            });
        }


        // Valida se o exercício do treino foi informado
        if (!treino_exercicios_id) {
            return res.status(422).json({
                message: "Selecione um exercício do treino!"
            });
        }


        // Valida se o usuário foi informado
        if (!usuario_id) {
            return res.status(422).json({
                message: "O usuário é obrigatório!"
            });
        }


        try {

            // Busca o usuário pela chave primária
            const usuario =
                await Usuarios.findByPk(usuario_id);


            // Verifica se o usuário existe
            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }


            // Busca a relação entre treino e exercício pela chave primária
            const treinoExercicio =
                await Treino_exercicios.findByPk(
                    treino_exercicios_id
                );


            // Verifica se a relação treino/exercício existe
            if (!treinoExercicio) {
                return res.status(404).json({
                    message: "Treino/Exercício não encontrado!"
                });
            }


            // Cria um novo registro no histórico de cargas
            await Historico_cargas.create({
                peso,
                treino_exercicios_id,
                usuario_id,

                // Salva a data e hora atual
                data_inicial: new Date()
            });


            // Retorna sucesso
            return res.status(200).json({
                message: "Carga registrada com sucesso!"
            });


        } catch (error) {

            // Registra o erro no Logger
            Logger.error(
                `Erro ao registrar carga: ${error}`
            );


            // Retorna erro interno do servidor
            return res.status(500).json({
                message: "Erro ao registrar carga!"
            });

        }

    }


    // =========================================
    // BUSCAR HISTÓRICO POR EXERCÍCIO
    // =========================================
    static async getHistoricoPorExercicio(req, res) {

        // Recebe o ID através dos parâmetros da rota
        const { id } = req.params;

        // Recebe usuario_id através da query da URL
        // Exemplo: ?usuario_id=5
        const { usuario_id } = req.query;


        // Valida se o usuário foi informado
        if (!usuario_id) {
            return res.status(422).json({
                message: "O usuário é obrigatório!"
            });
        }


        try {

            // Busca a relação treino/exercício pela chave primária
            const treinoExercicio =
                await Treino_exercicios.findByPk(id);


            // Verifica se a relação existe
            if (!treinoExercicio) {
                return res.status(404).json({
                    message: "Treino/Exercício não encontrado!"
                });
            }


            // Busca os registros do histórico de cargas
            const historico =
                await Historico_cargas.findAll({

                    // Filtra pelo treino/exercício e pelo usuário
                    where: {
                        treino_exercicios_id: id,
                        usuario_id
                    },

                    // Define quais campos serão retornados
                    attributes: [
                        "id",
                        "peso",
                        "data_inicial"
                    ],

                    // Ordena pela data em ordem crescente
                    order: [
                        ["data_inicial", "ASC"]
                    ]
                });


            // Retorna o histórico encontrado
            return res.status(200).json(
                historico
            );


        } catch (error) {

            // Registra o erro no Logger
            Logger.error(
                `Erro ao buscar histórico de cargas: ${error}`
            );


            // Retorna erro interno do servidor
            return res.status(500).json({
                message: "Erro ao buscar histórico de cargas!"
            });

        }

    }


    // =========================================
    // BUSCAR HISTÓRICO POR USUÁRIO
    // =========================================
    static async getHistoricoPorUsuario(req, res) {

        // Recebe usuario_id através dos parâmetros da rota
        const { usuario_id } = req.params;


        try {

            // Busca o usuário pela chave primária
            const usuario =
                await Usuarios.findByPk(usuario_id);


            // Verifica se o usuário existe
            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }


            // Busca todo o histórico de cargas do usuário
            const historico =
                await Historico_cargas.findAll({

                    // Filtra os registros pelo usuário informado
                    where: {
                        usuario_id
                    },

                    // Traz também os dados relacionados
                    // da tabela Treino_exercicios
                    include: [
                        {
                            model: Treino_exercicios,

                            // Define quais campos relacionados serão retornados
                            attributes: [
                                "id",
                                "exercicio_id",
                                "treino_id"
                            ]
                        }
                    ],

                    // Ordena os registros pela data em ordem crescente
                    order: [
                        ["data_inicial", "ASC"]
                    ]
                });


            // Retorna o histórico encontrado
            return res.status(200).json(
                historico
            );


        } catch (error) {

            // Registra o erro no Logger
            Logger.error(
                `Erro ao buscar histórico do usuário: ${error}`
            );


            // Retorna erro interno do servidor
            return res.status(500).json({
                message: "Erro ao buscar histórico do usuário!"
            });

        }

    }

}