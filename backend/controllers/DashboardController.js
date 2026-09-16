import { Op } from "sequelize";

import Usuarios from "../models/Usuarios.js";
import Agenda_treinos from "../models/Agenda_treinos.js";
import Treinos from "../models/Treinos.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
import Exercicios from "../models/Exercicios.js";
import Historico_cargas from "../models/Historico_cargas.js";
import Avaliacoes from "../models/Avaliacoes.js";

import Logger from "../db/logger.js";


export default class DashboardController {

    static async getDashboard(req, res) {

        const { usuario_id } = req.params;


        try {

            // =========================================
            // USUÁRIO
            // =========================================

            const usuario =
                await Usuarios.findByPk(
                    usuario_id
                );


            if (!usuario) {

                return res.status(404).json({
                    message:
                        "Usuário não encontrado!"
                });

            }


            // =========================================
            // DATA DE HOJE
            // =========================================

            const hoje =
                new Date();


            const ano =
                hoje.getFullYear();


            const mes =
                String(
                    hoje.getMonth() + 1
                ).padStart(2, "0");


            const dia =
                String(
                    hoje.getDate()
                ).padStart(2, "0");


            const dataHoje =
                `${ano}-${mes}-${dia}`;


            // =========================================
            // AVALIAÇÃO MAIS RECENTE
            // =========================================

            const ultimaAvaliacao =
                await Avaliacoes.findOne({

                    where: {
                        usuario_id
                    },

                    order: [
                        ["data_avaliacao", "DESC"],
                        ["id", "DESC"]
                    ]

                });


            // =========================================
            // TREINO DE HOJE
            // =========================================

            const agenda =
                await Agenda_treinos.findOne({

                    where: {
                        usuario_id,
                        data: dataHoje
                    },

                    order: [
                        ["id", "DESC"]
                    ]

                });


            let treino = null;
            let exercicios = [];

            let maiorCarga = null;
            let ultimaCarga = null;

            let evolucaoCarga = [];


            if (agenda) {

                treino =
                    await Treinos.findByPk(
                        agenda.treino_id
                    );


                const treinoExercicios =
                    await Treino_exercicios.findAll({

                        where: {
                            treino_id:
                                agenda.treino_id
                        },

                        include: [
                            {
                                model: Exercicios,

                                attributes: [
                                    "id",
                                    "nome",
                                    "grupo_muscular"
                                ]
                            }
                        ],

                        order: [
                            ["id", "ASC"]
                        ]

                    });


                exercicios =
                    treinoExercicios.map(
                        (item) => ({

                            id:
                                item.id,

                            series:
                                item.series,

                            repeticoes:
                                item.repeticoes,

                            exercicio:
                                item.exercicio

                        })
                    );


                const idsTreinoExercicios =
                    treinoExercicios.map(
                        (item) =>
                            item.id
                    );


                // =========================================
                // CARGAS DO USUÁRIO
                // =========================================

                if (
                    idsTreinoExercicios.length > 0
                ) {

                    const historicos =
                        await Historico_cargas.findAll({

                            where: {

                                usuario_id,

                                treino_exercicios_id: {
                                    [Op.in]:
                                        idsTreinoExercicios
                                }

                            },

                            order: [
                                ["data_inicial", "ASC"],
                                ["id", "ASC"]
                            ]

                        });


                    if (
                        historicos.length > 0
                    ) {

                        ultimaCarga =
                            Number(
                                historicos[
                                    historicos.length - 1
                                ].peso
                            );


                        maiorCarga =
                            Math.max(
                                ...historicos.map(
                                    (item) =>
                                        Number(
                                            item.peso
                                        )
                                )
                            );


                        evolucaoCarga =
                            historicos.map(
                                (item) => ({

                                    data:
                                        item.data_inicial,

                                    carga:
                                        Number(
                                            item.peso
                                        )

                                })
                            );

                    }

                }

            }


            // =========================================
            // ESTATÍSTICAS DOS TREINOS
            // =========================================

            const quantidadeTreinos =
                await Agenda_treinos.count({

                    where: {
                        usuario_id
                    }

                });


            const quantidadeTreinosConcluidos =
                await Agenda_treinos.count({

                    where: {

                        usuario_id,

                        status:
                            "concluido"

                    }

                });


            // =========================================
            // RESPOSTA
            // =========================================

            return res.status(200).json({

                usuario: {

                    id:
                        usuario.id,

                    nome:
                        usuario.nome,

                    peso:
                        ultimaAvaliacao
                            ? Number(
                                ultimaAvaliacao.peso
                            )
                            : usuario.peso,

                    altura:
                        ultimaAvaliacao
                            ? Number(
                                ultimaAvaliacao.altura
                            )
                            : usuario.altura,

                    objetivo:
                        usuario.objetivo,

                    imc:
                        ultimaAvaliacao
                            ? Number(
                                ultimaAvaliacao.imc
                            )
                            : usuario.imc

                },


                treino_hoje:
                    treino && agenda
                        ? {

                            ...treino.toJSON(),

                            agenda_id:
                                agenda.id,

                            status:
                                agenda.status,

                            exercicios

                        }
                        : null,


                estatisticas: {

                    treinos_agendados:
                        quantidadeTreinos,

                    treinos_concluidos:
                        quantidadeTreinosConcluidos,

                    exercicios_no_treino:
                        exercicios.length,

                    maior_carga:
                        maiorCarga,

                    ultima_carga:
                        ultimaCarga

                },


                evolucao_carga:
                    evolucaoCarga

            });


        } catch (error) {

            Logger.error(
                `Erro ao carregar dashboard: ${error}`
            );


            return res.status(500).json({

                message:
                    "Erro ao carregar dashboard!"

            });

        }

    }

}