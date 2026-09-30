// Importa o model de Avaliações
import Avaliacoes from "../models/Avaliacoes.js";

// Importa o model de Usuários
import Usuarios from "../models/Usuarios.js";

// Importa o Logger para registrar erros
import Logger from "../db/logger.js";


export default class AvaliacaoController {


    // =========================================
    // CRIAR AVALIAÇÃO
    // =========================================

    static async create(req, res) {

        // Recebe os dados enviados no corpo da requisição
        const {
            usuario_id,
            peso,
            altura,
            data_avaliacao,
            observacoes
        } = req.body;


        // Verifica se o aluno foi informado
        if (!usuario_id) {

            return res.status(422).json({
                message: "Selecione um aluno!"
            });

        }


        // Verifica se o peso foi informado
        if (!peso) {

            return res.status(422).json({
                message: "Informe o peso!"
            });

        }


        // Verifica se a altura foi informada
        if (!altura) {

            return res.status(422).json({
                message: "Informe a altura!"
            });

        }


        // Verifica se a data da avaliação foi informada
        if (!data_avaliacao) {

            return res.status(422).json({
                message: "Informe a data da avaliação!"
            });

        }


        try {

            // Busca o usuário pela chave primária
            const usuario =
                await Usuarios.findByPk(
                    usuario_id
                );


            // Verifica se o usuário existe
            if (!usuario) {

                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });

            }


            // Verifica se o usuário é do tipo aluno
            if (usuario.tipo_usuario !== "aluno") {

                return res.status(422).json({
                    message: "A avaliação deve pertencer a um aluno!"
                });

            }


            // Converte o peso para número
            const pesoNumero =
                Number(peso);

            // Converte a altura para número
            const alturaNumero =
                Number(altura);


            // Verifica se o peso é um número válido
            // e maior que zero
            if (
                Number.isNaN(pesoNumero) ||
                pesoNumero <= 0
            ) {

                return res.status(422).json({
                    message: "Informe um peso válido!"
                });

            }


            // Verifica se a altura é um número válido
            // e maior que zero
            if (
                Number.isNaN(alturaNumero) ||
                alturaNumero <= 0
            ) {

                return res.status(422).json({
                    message: "Informe uma altura válida!"
                });

            }


            // Calcula o IMC:
            // peso / (altura * altura)
            const imc =
                pesoNumero /
                (alturaNumero * alturaNumero);


            // Cria e salva uma nova avaliação
            // no banco de dados
            const avaliacao =
                await Avaliacoes.create({

                    usuario_id,

                    peso:
                        pesoNumero,

                    altura:
                        alturaNumero,

                    // Salva o IMC com duas casas decimais
                    imc:
                        Number(
                            imc.toFixed(2)
                        ),

                    data_avaliacao,

                    // Remove espaços do começo e do fim.
                    // Caso não tenha observação, salva uma string vazia.
                    observacoes:
                        observacoes?.trim() || ""

                });


            // Retorna status 201 indicando
            // que a avaliação foi criada com sucesso
            return res.status(201).json({

                message:
                    "Avaliação cadastrada com sucesso!",

                avaliacao

            });


        } catch (error) {

            // Registra o erro no Logger
            Logger.error(
                `Erro ao cadastrar avaliação: ${error}`
            );


            // Retorna erro interno do servidor
            return res.status(500).json({
                message: "Erro ao cadastrar avaliação!"
            });

        }

    }


    // =========================================
    // LISTAR TODAS AS AVALIAÇÕES
    // =========================================

    static async list(req, res) {

        try {

            // Busca todas as avaliações cadastradas
            const avaliacoes =
                await Avaliacoes.findAll({

                    // Traz também os dados do usuário
                    // relacionado a cada avaliação
                    include: [

                        {
                            model: Usuarios,

                            // Define quais dados do usuário
                            // serão retornados
                            attributes: [
                                "id",
                                "nome",
                                "email"
                            ]
                        }

                    ],

                    // Ordena pelas avaliações mais recentes
                    // para as mais antigas
                    order: [
                        ["data_avaliacao", "DESC"],
                        ["id", "DESC"]
                    ]

                });


            // Retorna as avaliações encontradas
            return res.status(200).json(
                avaliacoes
            );


        } catch (error) {

            // Registra o erro no Logger
            Logger.error(
                `Erro ao listar avaliações: ${error}`
            );


            return res.status(500).json({
                message: "Erro ao listar avaliações!"
            });

        }

    }


    // =========================================
    // BUSCAR AVALIAÇÃO PELO ID
    // =========================================

    static async getById(req, res) {

        // Recebe o ID da avaliação através
        // dos parâmetros da rota
        const id =
            req.params.id;


        // Verifica se o ID foi informado
        if (!id) {

            return res.status(422).json({
                message: "Informe o ID da avaliação!"
            });

        }


        try {

            // Busca a avaliação pela chave primária
            const avaliacao =
                await Avaliacoes.findByPk(
                    id,
                    {

                        // Traz também os dados
                        // do usuário relacionado
                        include: [

                            {
                                model: Usuarios,

                                attributes: [
                                    "id",
                                    "nome",
                                    "email"
                                ]
                            }

                        ]
                    }
                );


            // Verifica se a avaliação existe
            if (!avaliacao) {

                return res.status(404).json({
                    message: "Avaliação não encontrada!"
                });

            }


            // Retorna a avaliação encontrada
            return res.status(200).json(
                avaliacao
            );


        } catch (error) {

            Logger.error(
                `Erro ao buscar avaliação: ${error}`
            );


            return res.status(500).json({
                message: "Erro ao buscar avaliação!"
            });

        }

    }


    // =========================================
    // LISTAR AVALIAÇÕES DE UM ALUNO
    // =========================================

    static async listByUsuario(req, res) {

        // Recebe o ID do usuário através
        // dos parâmetros da rota
        const usuario_id =
            req.params.usuario_id;


        // Verifica se o usuário foi informado
        if (!usuario_id) {

            return res.status(422).json({
                message: "Informe o aluno!"
            });

        }


        try {

            // Busca o usuário pela chave primária
            const usuario =
                await Usuarios.findByPk(
                    usuario_id
                );


            // Verifica se o usuário existe
            if (!usuario) {

                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });

            }


            // Verifica se o usuário é um aluno
            if (usuario.tipo_usuario !== "aluno") {

                return res.status(422).json({
                    message: "O usuário informado não é um aluno!"
                });

            }


            // Busca todas as avaliações
            // relacionadas ao usuário
            const avaliacoes =
                await Avaliacoes.findAll({

                    // Filtra somente as avaliações
                    // daquele usuário
                    where: {
                        usuario_id
                    },

                    // Ordena das avaliações mais recentes
                    // para as mais antigas
                    order: [
                        ["data_avaliacao", "DESC"],
                        ["id", "DESC"]
                    ]

                });


            // Retorna as avaliações do aluno
            return res.status(200).json(
                avaliacoes
            );


        } catch (error) {

            Logger.error(
                `Erro ao buscar avaliações do aluno: ${error}`
            );


            return res.status(500).json({
                message: "Erro ao buscar avaliações do aluno!"
            });

        }

    }


    // =========================================
    // ATUALIZAR AVALIAÇÃO
    // =========================================

    static async update(req, res) {

        // Recebe os dados enviados
        // no corpo da requisição
        const {
            id,
            usuario_id,
            peso,
            altura,
            data_avaliacao,
            observacoes
        } = req.body;


        // Verifica se o ID da avaliação foi informado
        if (!id) {

            return res.status(422).json({
                message: "Informe o ID da avaliação!"
            });

        }


        // Verifica se o aluno foi informado
        if (!usuario_id) {

            return res.status(422).json({
                message: "Selecione um aluno!"
            });

        }


        // Verifica se o peso foi informado
        if (!peso) {

            return res.status(422).json({
                message: "Informe o peso!"
            });

        }


        // Verifica se a altura foi informada
        if (!altura) {

            return res.status(422).json({
                message: "Informe a altura!"
            });

        }


        // Verifica se a data foi informada
        if (!data_avaliacao) {

            return res.status(422).json({
                message: "Informe a data da avaliação!"
            });

        }


        try {

            // Busca a avaliação pela chave primária
            const avaliacao =
                await Avaliacoes.findByPk(
                    id
                );


            // Verifica se a avaliação existe
            if (!avaliacao) {

                return res.status(404).json({
                    message: "Avaliação não encontrada!"
                });

            }


            // Busca o usuário pela chave primária
            const usuario =
                await Usuarios.findByPk(
                    usuario_id
                );


            // Verifica se o usuário existe
            if (!usuario) {

                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });

            }


            // Verifica se o usuário é um aluno
            if (usuario.tipo_usuario !== "aluno") {

                return res.status(422).json({
                    message: "A avaliação deve pertencer a um aluno!"
                });

            }


            // Converte peso e altura para número
            const pesoNumero =
                Number(peso);

            const alturaNumero =
                Number(altura);


            // Valida o peso
            if (
                Number.isNaN(pesoNumero) ||
                pesoNumero <= 0
            ) {

                return res.status(422).json({
                    message: "Informe um peso válido!"
                });

            }


            // Valida a altura
            if (
                Number.isNaN(alturaNumero) ||
                alturaNumero <= 0
            ) {

                return res.status(422).json({
                    message: "Informe uma altura válida!"
                });

            }


            // Recalcula o IMC
            const imc =
                pesoNumero /
                (alturaNumero * alturaNumero);


            // Atualiza os dados da avaliação
            await avaliacao.update({

                usuario_id,

                peso:
                    pesoNumero,

                altura:
                    alturaNumero,

                // Salva o IMC com duas casas decimais
                imc:
                    Number(
                        imc.toFixed(2)
                    ),

                data_avaliacao,

                observacoes:
                    observacoes?.trim() || ""

            });


            // Retorna sucesso na atualização
            return res.status(200).json({
                message: "Avaliação atualizada com sucesso!"
            });


        } catch (error) {

            Logger.error(
                `Erro ao atualizar avaliação: ${error}`
            );


            return res.status(500).json({
                message: "Erro ao atualizar avaliação!"
            });

        }

    }


    // =========================================
    // EXCLUIR AVALIAÇÃO
    // =========================================

    static async delete(req, res) {

        // Recebe o ID da avaliação
        // através do corpo da requisição
        const {
            id
        } = req.body;


        // Verifica se o ID foi informado
        if (!id) {

            return res.status(422).json({
                message: "Informe o ID da avaliação!"
            });

        }


        try {

            // Busca a avaliação pela chave primária
            const avaliacao =
                await Avaliacoes.findByPk(
                    id
                );


            // Verifica se a avaliação existe
            if (!avaliacao) {

                return res.status(404).json({
                    message: "Avaliação não encontrada!"
                });

            }


            // Exclui a avaliação do banco de dados
            await avaliacao.destroy();


            // Retorna sucesso na exclusão
            return res.status(200).json({
                message: "Avaliação excluída com sucesso!"
            });


        } catch (error) {

            Logger.error(
                `Erro ao excluir avaliação: ${error}`
            );


            return res.status(500).json({
                message: "Erro ao excluir avaliação!"
            });

        }

    }

}