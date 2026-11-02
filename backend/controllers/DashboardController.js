import { Op } from "sequelize";
import Usuarios from "../models/Usuarios.js";
import Agenda_treinos from "../models/Agenda_treinos.js";
import Treinos from "../models/Treinos.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
import Exercicios from "../models/Exercicios.js";
import Historico_cargas from "../models/Historico_cargas.js";
import Avaliacoes from "../models/Avaliacoes.js";

import Logger from "../db/logger.js";

// Valida IDs recebidos nas requisições.
function idValido(valor) {
    if (
        typeof valor !== "string" &&
        typeof valor !== "number"
    ) {
        return false;
    }

    return Number.isSafeInteger(Number(valor)) && Number(valor) > 0;
}

// Define qual usuário pode ter o dashboard consultado.
function obterUsuarioAutorizado(req, res) {
    if (!req.usuario || !idValido(req.usuario.id)) {
        res.status(401).json({
            message: "Faça login para continuar!"
        });
        return null;
    }

    const perfil = req.usuario.tipo_usuario;

    if (perfil !== "personal" && perfil !== "aluno") {
        res.status(403).json({
            message: "Perfil sem permissão de acesso!"
        });
        return null;
    }

    const idInformado = req.params.usuario_id;

    if (!idValido(idInformado)) {
        res.status(422).json({
            message: "Informe um ID de usuário válido!"
        });
        return null;
    }

    if (perfil === "personal") {
        return Number(idInformado);
    }

    if (Number(idInformado) !== Number(req.usuario.id)) {
        res.status(403).json({
            message: "Você não pode acessar o dashboard de outro usuário!"
        });
        return null;
    }

    // A identidade utilizada nas consultas vem da sessão.
    return Number(req.usuario.id);
}

export default class DashboardController {

    static async getDashboard(req, res) {
        const usuarioId = obterUsuarioAutorizado(req, res);

        if (usuarioId === null) {
            return;
        }

        try {
            // Busca somente os campos necessários.
            const usuario = await Usuarios.findByPk(usuarioId, {
                attributes: [
                    "id",
                    "nome",
                    "peso",
                    "altura",
                    "objetivo",
                    "imc"
                ]
            });

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            // Data atual no horário local do servidor.
            const hoje = new Date();
            const ano = hoje.getFullYear();
            const mes = String(hoje.getMonth() + 1).padStart(2, "0");
            const dia = String(hoje.getDate()).padStart(2, "0");
            const dataHoje = `${ano}-${mes}-${dia}`;

            // Avaliação mais recente do usuário autorizado.
            const ultimaAvaliacao = await Avaliacoes.findOne({
                where: {
                    usuario_id: usuarioId
                },
                order: [
                    ["data_avaliacao", "DESC"],
                    ["id", "DESC"]
                ]
            });

            // Agendamento de hoje do usuário autorizado.
            const agenda = await Agenda_treinos.findOne({
                where: {
                    usuario_id: usuarioId,
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
                // O treino consultado vem da agenda autorizada.
                treino = await Treinos.findByPk(agenda.treino_id);

                if (treino) {
                    const treinoExercicios =
                        await Treino_exercicios.findAll({
                            where: {
                                treino_id: treino.id
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

                    exercicios = treinoExercicios.map((item) => ({
                        id: item.id,
                        series: item.series,
                        repeticoes: item.repeticoes,
                        exercicio: item.exercicio
                    }));

                    const idsTreinoExercicios =
                        treinoExercicios.map((item) => item.id);

                    if (idsTreinoExercicios.length > 0) {
                        const historicos =
                            await Historico_cargas.findAll({
                                where: {
                                    // Impede retornar cargas de outros alunos.
                                    usuario_id: usuarioId,
                                    treino_exercicios_id: {
                                        [Op.in]: idsTreinoExercicios
                                    }
                                },
                                order: [
                                    ["data_inicial", "ASC"],
                                    ["id", "ASC"]
                                ]
                            });

                        if (historicos.length > 0) {
                            ultimaCarga = Number(
                                historicos[historicos.length - 1].peso
                            );

                            maiorCarga = historicos.reduce(
                                (maior, item) =>
                                    Math.max(maior, Number(item.peso)),
                                Number(historicos[0].peso)
                            );

                            evolucaoCarga = historicos.map((item) => ({
                                data: item.data_inicial,
                                carga: Number(item.peso)
                            }));
                        }
                    }
                }
            }

            // Estatísticas limitadas ao mesmo usuário autorizado.
            const quantidadeTreinos = await Agenda_treinos.count({
                where: {
                    usuario_id: usuarioId
                }
            });

            const quantidadeTreinosConcluidos =
                await Agenda_treinos.count({
                    where: {
                        usuario_id: usuarioId,
                        status: "concluido"
                    }
                });

            return res.status(200).json({
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    peso: ultimaAvaliacao
                        ? Number(ultimaAvaliacao.peso)
                        : usuario.peso,
                    altura: ultimaAvaliacao
                        ? Number(ultimaAvaliacao.altura)
                        : usuario.altura,
                    objetivo: usuario.objetivo,
                    imc: ultimaAvaliacao
                        ? Number(ultimaAvaliacao.imc)
                        : usuario.imc
                },

                treino_hoje: treino && agenda
                    ? {
                        ...treino.toJSON(),
                        agenda_id: agenda.id,
                        status: agenda.status,
                        exercicios
                    }
                    : null,

                estatisticas: {
                    treinos_agendados: quantidadeTreinos,
                    treinos_concluidos: quantidadeTreinosConcluidos,
                    exercicios_no_treino: exercicios.length,
                    maior_carga: maiorCarga,
                    ultima_carga: ultimaCarga
                },

                evolucao_carga: evolucaoCarga
            });

        } catch (error) {
            Logger.error(`Erro ao carregar dashboard: ${error}`);

            return res.status(500).json({
                message: "Erro ao carregar dashboard!"
            });
        }
    }
}