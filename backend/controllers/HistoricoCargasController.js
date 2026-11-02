import Historico_cargas from "../models/Historico_cargas.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
import Usuarios from "../models/Usuarios.js";
import Agenda_treinos from "../models/Agenda_treinos.js";
import Logger from "../db/logger.js";

// Aceita apenas IDs inteiros positivos.
function idValido(valor) {
    if (
        typeof valor !== "string" &&
        typeof valor !== "number"
    ) {
        return false;
    }

    const numero = Number(valor);

    return Number.isSafeInteger(numero) && numero > 0;
}

// Verifica a sessão e define o usuário autorizado.
// Para alunos, o ID utilizado vem do middleware JWT.
function obterUsuarioAutorizado(req, res, idInformado) {
    if (!req.usuario) {
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

    const informouId =
        idInformado !== undefined &&
        idInformado !== null;

    if (informouId && !idValido(idInformado)) {
        res.status(422).json({
            message: "Informe um ID de usuário válido!"
        });
        return null;
    }

    if (perfil === "personal") {
        if (!informouId) {
            res.status(422).json({
                message: "Informe o usuário!"
            });
            return null;
        }

        return Number(idInformado);
    }

    const usuarioId = Number(req.usuario.id);

    if (!idValido(usuarioId)) {
        res.status(401).json({
            message: "Sessão inválida. Faça login novamente!"
        });
        return null;
    }

    if (informouId && Number(idInformado) !== usuarioId) {
        res.status(403).json({
            message: "Você não pode acessar os dados de outro usuário!"
        });
        return null;
    }

    return usuarioId;
}

export default class HistoricoCargasController {

    // Registrar uma nova carga
    static async create(req, res) {
        const {
            peso,
            treino_exercicios_id,
            usuario_id
        } = req.body || {};

        const usuarioId = obterUsuarioAutorizado(
            req,
            res,
            usuario_id
        );

        if (usuarioId === null) {
            return;
        }

        if (
            (typeof peso !== "string" && typeof peso !== "number") ||
            String(peso).trim() === "" ||
            !Number.isFinite(Number(peso)) ||
            Number(peso) <= 0
        ) {
            return res.status(422).json({
                message: "Informe um peso válido, maior que zero!"
            });
        }

        if (!idValido(treino_exercicios_id)) {
            return res.status(422).json({
                message: "Selecione um exercício do treino válido!"
            });
        }

        try {
            const usuario = await Usuarios.findByPk(usuarioId);

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            if (usuario.tipo_usuario !== "aluno") {
                return res.status(422).json({
                    message: "As cargas devem ser registradas para um aluno!"
                });
            }

            const treinoExercicio =
                await Treino_exercicios.findByPk(
                    Number(treino_exercicios_id)
                );

            if (!treinoExercicio) {
                return res.status(404).json({
                    message: "Treino/Exercício não encontrado!"
                });
            }

            // O aluno só pode registrar cargas de um treino
            // que esteja vinculado à sua própria agenda.
            if (req.usuario.tipo_usuario === "aluno") {
                const agendamento = await Agenda_treinos.findOne({
                    where: {
                        usuario_id: usuarioId,
                        treino_id: treinoExercicio.treino_id
                    },
                    attributes: ["id"]
                });

                if (!agendamento) {
                    return res.status(403).json({
                        message:
                            "Este treino não está vinculado à sua agenda!"
                    });
                }
            }

            await Historico_cargas.create({
                peso: Number(peso),
                treino_exercicios_id: treinoExercicio.id,
                usuario_id: usuarioId,
                data_inicial: new Date()
            });

            return res.status(200).json({
                message: "Carga registrada com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao registrar carga: ${error}`);

            return res.status(500).json({
                message: "Erro ao registrar carga!"
            });
        }
    }

    // Buscar histórico de um exercício para o usuário autorizado
    static async getHistoricoPorExercicio(req, res) {
        const usuarioId = obterUsuarioAutorizado(
            req,
            res,
            req.query.usuario_id
        );

        if (usuarioId === null) {
            return;
        }

        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(422).json({
                message: "Informe um ID de treino/exercício válido!"
            });
        }

        try {
            const treinoExercicio =
                await Treino_exercicios.findByPk(Number(id));

            if (!treinoExercicio) {
                return res.status(404).json({
                    message: "Treino/Exercício não encontrado!"
                });
            }

            // Mesmo com um ID de exercício arbitrário,
            // a consulta permanece limitada ao usuário autorizado.
            const historico = await Historico_cargas.findAll({
                where: {
                    treino_exercicios_id: treinoExercicio.id,
                    usuario_id: usuarioId
                },
                attributes: [
                    "id",
                    "peso",
                    "data_inicial"
                ],
                order: [
                    ["data_inicial", "ASC"]
                ]
            });

            return res.status(200).json(historico);

        } catch (error) {
            Logger.error(
                `Erro ao buscar histórico de cargas: ${error}`
            );

            return res.status(500).json({
                message: "Erro ao buscar histórico de cargas!"
            });
        }
    }

    // Buscar todo o histórico do usuário autorizado
    static async getHistoricoPorUsuario(req, res) {
        const usuarioId = obterUsuarioAutorizado(
            req,
            res,
            req.params.usuario_id
        );

        if (usuarioId === null) {
            return;
        }

        try {
            const usuario = await Usuarios.findByPk(usuarioId);

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            const historico = await Historico_cargas.findAll({
                where: {
                    usuario_id: usuarioId
                },
                include: [
                    {
                        model: Treino_exercicios,
                        attributes: [
                            "id",
                            "exercicio_id",
                            "treino_id"
                        ]
                    }
                ],
                order: [
                    ["data_inicial", "ASC"]
                ]
            });

            return res.status(200).json(historico);

        } catch (error) {
            Logger.error(
                `Erro ao buscar histórico do usuário: ${error}`
            );

            return res.status(500).json({
                message: "Erro ao buscar histórico do usuário!"
            });
        }
    }
}