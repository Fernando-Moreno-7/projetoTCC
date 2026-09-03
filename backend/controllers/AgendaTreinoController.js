import Agenda_treinos from "../models/Agenda_treinos.js";
import Logger from "../db/logger.js";

import Usuarios from "../models/Usuarios.js";
import Treinos from "../models/Treinos.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
import Exercicios from "../models/Exercicios.js";
import Historico_cargas from "../models/Historico_cargas.js";


export default class AgendaTreinoController {


    // =========================================
    // CRIAR AGENDAMENTO
    // FUNÇÕES DO PERSONAL
    // =========================================

    static async agendar(req, res) {

        const {
            usuario_id,
            treino_id,
            data,
            status
        } = req.body;

        if (!usuario_id || !treino_id || !data) {

            return res.status(422).json({
                message: "Preencha usuário, treino e data!"
            });

        }

        try {

            const usuario = await Usuarios.findByPk(usuario_id);

            const treino = await Treinos.findByPk(treino_id);

            if (!usuario) {

                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });

            }

            if (!treino) {

                return res.status(404).json({
                    message: "Treino não encontrado!"
                });

            }

            await Agenda_treinos.create({

                usuario_id,

                treino_id,

                data,

                status: status || "pendente"

            });

            return res.status(200).json({
                message: "Treino agendado com sucesso!"
            });

        } catch (error) {

            Logger.error(`Erro ao agendar treino: ${error}`);

            return res.status(500).json({
                message: "Erro ao agendar treino!"
            });

        }

    }


    // =========================================
    // LISTAR TODOS OS AGENDAMENTOS
    // FUNÇÕES DO PERSONAL
    // =========================================

    static async list(req, res) {

        try {

            const agenda = await Agenda_treinos.findAll({

                include: [

                    {
                        model: Usuarios,
                        attributes: [
                            "id",
                            "nome",
                            "email"
                        ]
                    },

                    {
                        model: Treinos,
                        attributes: [
                            "id",
                            "nome",
                            "descricao"
                        ]
                    }

                ],

                order: [
                    ["data", "ASC"]
                ]

            });

            return res.status(200).json(agenda);

        } catch (error) {

            Logger.error(`Erro ao listar agenda: ${error}`);

            return res.status(500).json({
                message: "Erro ao listar agenda!"
            });

        }

    }


    // =========================================
    // BUSCAR AGENDAMENTO PELO ID
    // FUNÇÕES DO PERSONAL
    // =========================================

    static async getById(req, res) {

        const id = req.params.id;

        try {

            const item = await Agenda_treinos.findByPk(id, {

                include: [

                    {
                        model: Usuarios,
                        attributes: [
                            "id",
                            "nome",
                            "email"
                        ]
                    },

                    {
                        model: Treinos,
                        attributes: [
                            "id",
                            "nome",
                            "descricao"
                        ]
                    }

                ]

            });

            if (!item) {

                return res.status(404).json({
                    message: "Agendamento não encontrado!"
                });

            }

            return res.status(200).json(item);

        } catch (error) {

            Logger.error(`Erro ao buscar agenda: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar agenda!"
            });

        }

    }


    // =========================================
    // ATUALIZAR AGENDAMENTO
    // FUNÇÕES DO PERSONAL
    // =========================================

    static async update(req, res) {

        const {
            id,
            usuario_id,
            treino_id,
            data,
            status
        } = req.body;

        if (!id) {

            return res.status(422).json({
                message: "Informe o ID do agendamento!"
            });

        }

        if (!usuario_id) {

            return res.status(422).json({
                message: "Selecione um aluno!"
            });

        }

        if (!treino_id) {

            return res.status(422).json({
                message: "Selecione um treino!"
            });

        }

        if (!data) {

            return res.status(422).json({
                message: "Informe a data do treino!"
            });

        }

        if (!status) {

            return res.status(422).json({
                message: "Informe o status do agendamento!"
            });

        }

        try {

            const agenda = await Agenda_treinos.findByPk(id);

            if (!agenda) {

                return res.status(404).json({
                    message: "Agendamento não encontrado!"
                });

            }

            const usuario = await Usuarios.findByPk(usuario_id);

            if (!usuario) {

                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });

            }

            const treino = await Treinos.findByPk(treino_id);

            if (!treino) {

                return res.status(404).json({
                    message: "Treino não encontrado!"
                });

            }

            await Agenda_treinos.update(

                {
                    usuario_id,
                    treino_id,
                    data,
                    status
                },

                {
                    where: {
                        id
                    }
                }

            );

            return res.status(200).json({
                message: "Agendamento atualizado com sucesso!"
            });

        } catch (error) {

            Logger.error(`Erro ao atualizar agenda: ${error}`);

            return res.status(500).json({
                message: "Erro ao atualizar agenda!"
            });

        }

    }


    // =========================================
    // EXCLUIR AGENDAMENTO
    // FUNÇÕES DO PERSONAL
    // =========================================

    static async delete(req, res) {

        const {
            id
        } = req.body;

        if (!id) {

            return res.status(422).json({
                message: "Informe o ID do agendamento!"
            });

        }

        try {

            const agenda = await Agenda_treinos.findByPk(id);

            if (!agenda) {

                return res.status(404).json({
                    message: "Agendamento não encontrado!"
                });

            }

            await Agenda_treinos.destroy({

                where: {
                    id
                }

            });

            return res.status(200).json({
                message: "Agendamento removido com sucesso!"
            });

        } catch (error) {

            Logger.error(`Erro ao remover agenda: ${error}`);

            return res.status(500).json({
                message: "Erro ao remover agenda!"
            });

        }

    }


    // =========================================
    // BUSCAR TREINO DO USUÁRIO
    // FUNÇÕES DO ALUNO
    // =========================================

    static async getTreinoDoUsuario(req, res) {

        const {
            usuario_id
        } = req.params;

        try {

            const agenda = await Agenda_treinos.findOne({

                where: {
                    usuario_id
                },

                order: [
                    ["data", "DESC"]
                ]

            });

            if (!agenda) {

                return res.status(404).json({
                    message: "Usuário não possui treino cadastrado!"
                });

            }

            const treino = await Treinos.findByPk(
                agenda.treino_id
            );

            if (!treino) {

                return res.status(404).json({
                    message: "Treino não encontrado!"
                });

            }

            const treinoExercicios =
                await Treino_exercicios.findAll({

                    where: {
                        treino_id: treino.id
                    },

                    include: [

                        {
                            model: Exercicios
                        }

                    ]

                });

            const exercicios = [];

            for (const item of treinoExercicios) {

                const ultimaCarga =
                    await Historico_cargas.findOne({

                        where: {
                            treino_exercicios_id: item.id
                        },

                        order: [
                            ["data_inicial", "DESC"]
                        ]

                    });

                exercicios.push({

                    id: item.id,

                    exercicio_id:
                        item.exercicio.id,

                    nome:
                        item.exercicio.nome,

                    grupo_muscular:
                        item.exercicio.grupo_muscular,

                    imagem:
                        item.exercicio.imagem,

                    descricao:
                        item.exercicio.descricao,

                    series:
                        item.series,

                    repeticoes:
                        item.repeticoes,

                    ultima_carga:
                        ultimaCarga
                            ? ultimaCarga.peso
                            : null

                });

            }

            return res.status(200).json({

                agenda,

                treino,

                exercicios

            });

        } catch (error) {

            Logger.error(
                `Erro ao buscar treino do usuário: ${error}`
            );

            return res.status(500).json({
                message: "Erro ao buscar treino do usuário!"
            });

        }

    }


    // =========================================
    // FINALIZAR TREINO
    // FUNÇÕES DO ALUNO
    // =========================================

    static async finalizarTreino(req, res) {

        const {
            id
        } = req.body;

        if (!id) {

            return res.status(422).json({
                message: "Informe o ID do agendamento!"
            });

        }

        try {

            const agenda = await Agenda_treinos.findByPk(id);

            if (!agenda) {

                return res.status(404).json({
                    message: "Agendamento não encontrado!"
                });

            }

            await Agenda_treinos.update(

                {
                    status: "concluido"
                },

                {
                    where: {
                        id
                    }
                }

            );

            return res.status(200).json({
                message: "Treino finalizado com sucesso!"
            });

        } catch (error) {

            Logger.error(
                `Erro ao finalizar treino: ${error}`
            );

            return res.status(500).json({
                message: "Erro ao finalizar treino!"
            });

        }

    }


    // =========================================
    // HISTÓRICO DE TREINOS DO ALUNO
    // FUNÇÕES DO ALUNO
    // =========================================

    static async historico(req, res) {

        const {
            usuario_id
        } = req.params;

        try {

            const historico =
                await Agenda_treinos.findAll({

                    where: {

                        usuario_id,

                        status: "concluido"

                    },

                    include: [

                        {
                            model: Treinos,

                            attributes: [
                                "id",
                                "nome",
                                "descricao"
                            ]
                        }

                    ],

                    order: [
                        ["data", "DESC"]
                    ]

                });

            return res.status(200).json(historico);

        } catch (error) {

            Logger.error(
                `Erro ao buscar histórico: ${error}`
            );

            return res.status(500).json({
                message: "Erro ao buscar histórico!"
            });

        }

    }

}