import Usuarios from "../models/Usuarios.js";
import Agenda_treinos from "../models/Agenda_treinos.js";
import Treinos from "../models/Treinos.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
import Logger from "../db/logger.js";

export default class DashboardController {

    static async getDashboard(req, res) {

        const { usuario_id } = req.params;

        try {

            const usuario = await Usuarios.findByPk(usuario_id);

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            const agenda = await Agenda_treinos.findOne({
                where: {
                    usuario_id
                }
            });

            let treino = null;
            let quantidadeExercicios = 0;

            if (agenda) {

                treino = await Treinos.findByPk(
                    agenda.treino_id
                );

                quantidadeExercicios =
                    await Treino_exercicios.count({
                        where: {
                            treino_id: agenda.treino_id
                        }
                    });

            }

            const quantidadeTreinos =
                await Agenda_treinos.count({
                    where: {
                        usuario_id
                    }
                });

            return res.status(200).json({

                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    peso: usuario.peso,
                    altura: usuario.altura,
                    objetivo: usuario.objetivo,
                    imc: usuario.imc
                },

                treino_hoje: treino,

                estatisticas: {

                    treinos_agendados:
                        quantidadeTreinos,

                    exercicios_no_treino:
                        quantidadeExercicios

                }

            });

        } catch (error) {

            Logger.error(error);

            return res.status(500).json({
                message: "Erro ao carregar dashboard!"
            });

        }

    }

}