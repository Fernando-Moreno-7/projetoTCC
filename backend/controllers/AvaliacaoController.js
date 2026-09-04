import Avaliacoes from "../models/Avaliacoes.js";
import Usuarios from "../models/Usuarios.js";
import Logger from "../db/logger.js";


export default class AvaliacaoController {


    // =========================================
    // CRIAR AVALIAÇÃO
    // =========================================

    static async create(req, res) {

        const {
            usuario_id,
            peso,
            altura,
            data_avaliacao,
            observacoes
        } = req.body;


        if (!usuario_id) {

            return res.status(422).json({
                message: "Selecione um aluno!"
            });

        }


        if (!peso) {

            return res.status(422).json({
                message: "Informe o peso!"
            });

        }


        if (!altura) {

            return res.status(422).json({
                message: "Informe a altura!"
            });

        }


        if (!data_avaliacao) {

            return res.status(422).json({
                message: "Informe a data da avaliação!"
            });

        }


        try {

            const usuario = await Usuarios.findByPk(usuario_id);


            if (!usuario) {

                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });

            }


            const pesoNumero = Number(peso);

            const alturaNumero = Number(altura);


            if (
                Number.isNaN(pesoNumero) ||
                pesoNumero <= 0
            ) {

                return res.status(422).json({
                    message: "Informe um peso válido!"
                });

            }


            if (
                Number.isNaN(alturaNumero) ||
                alturaNumero <= 0
            ) {

                return res.status(422).json({
                    message: "Informe uma altura válida!"
                });

            }


            const imc =
                pesoNumero /
                (alturaNumero * alturaNumero);


            await Avaliacoes.create({

                usuario_id,

                peso: pesoNumero,

                altura: alturaNumero,

                imc: imc.toFixed(2),

                data_avaliacao,

                observacoes:
                    observacoes || ""

            });


            return res.status(200).json({
                message: "Avaliação cadastrada com sucesso!"
            });


        } catch (error) {

            Logger.error(
                `Erro ao cadastrar avaliação: ${error}`
            );

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

            const avaliacoes =
                await Avaliacoes.findAll({

                    include: [

                        {
                            model: Usuarios,

                            attributes: [
                                "id",
                                "nome",
                                "email"
                            ]
                        }

                    ],

                    order: [
                        ["data_avaliacao", "DESC"]
                    ]

                });


            return res.status(200).json(avaliacoes);


        } catch (error) {

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

        const id = req.params.id;


        try {

            const avaliacao =
                await Avaliacoes.findByPk(
                    id,
                    {
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


            if (!avaliacao) {

                return res.status(404).json({
                    message: "Avaliação não encontrada!"
                });

            }


            return res.status(200).json(avaliacao);


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

        const usuario_id =
            req.params.usuario_id;


        try {

            const usuario =
                await Usuarios.findByPk(
                    usuario_id
                );


            if (!usuario) {

                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });

            }


            const avaliacoes =
                await Avaliacoes.findAll({

                    where: {
                        usuario_id
                    },

                    order: [
                        ["data_avaliacao", "DESC"]
                    ]

                });


            return res.status(200).json(avaliacoes);


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

        const {
            id,
            usuario_id,
            peso,
            altura,
            data_avaliacao,
            observacoes
        } = req.body;


        if (!id) {

            return res.status(422).json({
                message: "Informe o ID da avaliação!"
            });

        }


        if (!usuario_id) {

            return res.status(422).json({
                message: "Selecione um aluno!"
            });

        }


        if (!peso) {

            return res.status(422).json({
                message: "Informe o peso!"
            });

        }


        if (!altura) {

            return res.status(422).json({
                message: "Informe a altura!"
            });

        }


        if (!data_avaliacao) {

            return res.status(422).json({
                message: "Informe a data da avaliação!"
            });

        }


        try {

            const avaliacao =
                await Avaliacoes.findByPk(id);


            if (!avaliacao) {

                return res.status(404).json({
                    message: "Avaliação não encontrada!"
                });

            }


            const usuario =
                await Usuarios.findByPk(
                    usuario_id
                );


            if (!usuario) {

                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });

            }


            const pesoNumero = Number(peso);

            const alturaNumero = Number(altura);


            if (
                Number.isNaN(pesoNumero) ||
                pesoNumero <= 0
            ) {

                return res.status(422).json({
                    message: "Informe um peso válido!"
                });

            }


            if (
                Number.isNaN(alturaNumero) ||
                alturaNumero <= 0
            ) {

                return res.status(422).json({
                    message: "Informe uma altura válida!"
                });

            }


            const imc =
                pesoNumero /
                (alturaNumero * alturaNumero);


            await Avaliacoes.update(

                {
                    usuario_id,

                    peso:
                        pesoNumero,

                    altura:
                        alturaNumero,

                    imc:
                        imc.toFixed(2),

                    data_avaliacao,

                    observacoes:
                        observacoes || ""
                },

                {
                    where: {
                        id
                    }
                }

            );


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

        const {
            id
        } = req.body;


        if (!id) {

            return res.status(422).json({
                message: "Informe o ID da avaliação!"
            });

        }


        try {

            const avaliacao =
                await Avaliacoes.findByPk(id);


            if (!avaliacao) {

                return res.status(404).json({
                    message: "Avaliação não encontrada!"
                });

            }


            await Avaliacoes.destroy({

                where: {
                    id
                }

            });


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