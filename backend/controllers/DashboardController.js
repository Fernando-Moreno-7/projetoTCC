import Usuarios from "../models/Usuarios.js";
import Agenda_treinos from "../models/Agenda_treinos.js";
import Treinos from "../models/Treinos.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
import Logger from "../db/logger.js";
import Historico_cargas from "../models/Historico_cargas.js";

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
                const quantidadeTreinosConcluidos =
    await Agenda_treinos.count({
        where: {
            usuario_id,
            status: "concluido"
        }
    });

let maiorCarga = null;
let ultimaCarga = null;

if (treino) {

    const treinoExercicios = await Treino_exercicios.findAll({
        where: {
            treino_id: treino.id
        }
    });

    const idsTreinoExercicios =
        treinoExercicios.map(item => item.id);

    if (idsTreinoExercicios.length > 0) {

        const historicos =
            await Historico_cargas.findAll({
                where: {
                    treino_exercicios_id:
                        idsTreinoExercicios
                },
                order: [
                    ["data_inicial", "DESC"]
                ]
            });

        if (historicos.length > 0) {

            ultimaCarga = historicos[0].peso;

            maiorCarga = Math.max(
                ...historicos.map(item => item.peso)
            );

        }

    }

}

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

    treinos_concluidos:
        quantidadeTreinosConcluidos,

    exercicios_no_treino:
        quantidadeExercicios,

    maior_carga:
        maiorCarga,

    ultima_carga:
        ultimaCarga

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