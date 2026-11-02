import Avaliacoes from "../models/Avaliacoes.js";
import Usuarios from "../models/Usuarios.js";
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

// Confere a sessão criada pelo middleware JWT.
function verificarSessao(req, res) {
    if (!req.usuario || !idValido(req.usuario.id)) {
        res.status(401).json({
            message: "Faça login para continuar!"
        });
        return false;
    }

    if (
        req.usuario.tipo_usuario !== "personal" &&
        req.usuario.tipo_usuario !== "aluno"
    ) {
        res.status(403).json({
            message: "Perfil sem permissão de acesso!"
        });
        return false;
    }

    return true;
}

// Restringe as operações administrativas ao personal.
function verificarPersonal(req, res) {
    if (!verificarSessao(req, res)) {
        return false;
    }

    if (req.usuario.tipo_usuario !== "personal") {
        res.status(403).json({
            message: "Somente o personal pode realizar esta ação!"
        });
        return false;
    }

    return true;
}

// Valida os dados utilizados no cadastro e na atualização.
function validarDados(body, res) {
    const {
        usuario_id,
        peso,
        altura,
        data_avaliacao,
        observacoes
    } = body || {};

    if (!idValido(usuario_id)) {
        res.status(422).json({
            message: "Selecione um aluno válido!"
        });
        return null;
    }

    const numeroPositivo = (valor) =>
        (typeof valor === "string" || typeof valor === "number") &&
        String(valor).trim() !== "" &&
        Number.isFinite(Number(valor)) &&
        Number(valor) > 0;

    if (!numeroPositivo(peso)) {
        res.status(422).json({
            message: "Informe um peso válido!"
        });
        return null;
    }

    if (!numeroPositivo(altura)) {
        res.status(422).json({
            message: "Informe uma altura válida!"
        });
        return null;
    }

    if (
        typeof data_avaliacao !== "string" ||
        data_avaliacao.trim() === ""
    ) {
        res.status(422).json({
            message: "Informe a data da avaliação!"
        });
        return null;
    }

    if (
        observacoes !== undefined &&
        observacoes !== null &&
        typeof observacoes !== "string"
    ) {
        res.status(422).json({
            message: "As observações devem ser um texto!"
        });
        return null;
    }

    const pesoNumero = Number(peso);
    const alturaNumero = Number(altura);

    // Mantém a unidade utilizada neste controller:
    // peso em quilogramas e altura em metros.
    const imc = pesoNumero / (alturaNumero * alturaNumero);

    if (!Number.isFinite(imc)) {
        res.status(422).json({
            message: "Peso e altura inválidos para calcular o IMC!"
        });
        return null;
    }

    return {
        usuario_id: Number(usuario_id),
        peso: pesoNumero,
        altura: alturaNumero,
        imc: Number(imc.toFixed(2)),
        data_avaliacao: data_avaliacao.trim(),
        observacoes: observacoes?.trim() || ""
    };
}

export default class AvaliacaoController {

    // Criar avaliação: somente personal.
    static async create(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const dados = validarDados(req.body, res);

        if (!dados) {
            return;
        }

        try {
            const usuario = await Usuarios.findByPk(dados.usuario_id);

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            if (usuario.tipo_usuario !== "aluno") {
                return res.status(422).json({
                    message: "A avaliação deve pertencer a um aluno!"
                });
            }

            const avaliacao = await Avaliacoes.create(dados);

            return res.status(201).json({
                message: "Avaliação cadastrada com sucesso!",
                avaliacao
            });

        } catch (error) {
            Logger.error(`Erro ao cadastrar avaliação: ${error}`);

            return res.status(500).json({
                message: "Erro ao cadastrar avaliação!"
            });
        }
    }

    // Listar todas as avaliações: somente personal.
    static async list(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        try {
            const avaliacoes = await Avaliacoes.findAll({
                include: [
                    {
                        model: Usuarios,
                        attributes: ["id", "nome", "email"]
                    }
                ],
                order: [
                    ["data_avaliacao", "DESC"],
                    ["id", "DESC"]
                ]
            });

            return res.status(200).json(avaliacoes);

        } catch (error) {
            Logger.error(`Erro ao listar avaliações: ${error}`);

            return res.status(500).json({
                message: "Erro ao listar avaliações!"
            });
        }
    }

    // Buscar avaliação pelo ID respeitando o proprietário.
    static async getById(req, res) {
        if (!verificarSessao(req, res)) {
            return;
        }

        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(422).json({
                message: "Informe um ID de avaliação válido!"
            });
        }

        const where = {
            id: Number(id)
        };

        // O aluno só encontra avaliações que pertencem a ele.
        if (req.usuario.tipo_usuario === "aluno") {
            where.usuario_id = Number(req.usuario.id);
        }

        try {
            const avaliacao = await Avaliacoes.findOne({
                where,
                include: [
                    {
                        model: Usuarios,
                        attributes: ["id", "nome", "email"]
                    }
                ]
            });

            if (!avaliacao) {
                return res.status(404).json({
                    message: "Avaliação não encontrada!"
                });
            }

            return res.status(200).json(avaliacao);

        } catch (error) {
            Logger.error(`Erro ao buscar avaliação: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar avaliação!"
            });
        }
    }

    // Listar avaliações do usuário autorizado.
    static async listByUsuario(req, res) {
        if (!verificarSessao(req, res)) {
            return;
        }

        const idInformado = req.params.usuario_id;

        if (!idValido(idInformado)) {
            return res.status(422).json({
                message: "Informe um ID de aluno válido!"
            });
        }

        const aluno = req.usuario.tipo_usuario === "aluno";

        if (
            aluno &&
            Number(idInformado) !== Number(req.usuario.id)
        ) {
            return res.status(403).json({
                message:
                    "Você não pode consultar as avaliações de outro usuário!"
            });
        }

        // Para o aluno, a identidade da consulta vem da sessão.
        const usuarioId = aluno
            ? Number(req.usuario.id)
            : Number(idInformado);

        try {
            const usuario = await Usuarios.findByPk(usuarioId);

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            if (usuario.tipo_usuario !== "aluno") {
                return res.status(422).json({
                    message: "O usuário informado não é um aluno!"
                });
            }

            const avaliacoes = await Avaliacoes.findAll({
                where: {
                    usuario_id: usuarioId
                },
                order: [
                    ["data_avaliacao", "DESC"],
                    ["id", "DESC"]
                ]
            });

            return res.status(200).json(avaliacoes);

        } catch (error) {
            Logger.error(`Erro ao buscar avaliações do aluno: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar avaliações do aluno!"
            });
        }
    }

    // Atualizar avaliação: somente personal.
    static async update(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const { id } = req.body || {};

        if (!idValido(id)) {
            return res.status(422).json({
                message: "Informe um ID de avaliação válido!"
            });
        }

        const dados = validarDados(req.body, res);

        if (!dados) {
            return;
        }

        try {
            const avaliacao = await Avaliacoes.findByPk(Number(id));

            if (!avaliacao) {
                return res.status(404).json({
                    message: "Avaliação não encontrada!"
                });
            }

            const usuario = await Usuarios.findByPk(dados.usuario_id);

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            if (usuario.tipo_usuario !== "aluno") {
                return res.status(422).json({
                    message: "A avaliação deve pertencer a um aluno!"
                });
            }

            await avaliacao.update(dados);

            return res.status(200).json({
                message: "Avaliação atualizada com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao atualizar avaliação: ${error}`);

            return res.status(500).json({
                message: "Erro ao atualizar avaliação!"
            });
        }
    }

    // Excluir avaliação: somente personal.
    static async delete(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const { id } = req.body || {};

        if (!idValido(id)) {
            return res.status(422).json({
                message: "Informe um ID de avaliação válido!"
            });
        }

        try {
            const removidos = await Avaliacoes.destroy({
                where: {
                    id: Number(id)
                }
            });

            if (!removidos) {
                return res.status(404).json({
                    message: "Avaliação não encontrada!"
                });
            }

            return res.status(200).json({
                message: "Avaliação excluída com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao excluir avaliação: ${error}`);

            return res.status(500).json({
                message: "Erro ao excluir avaliação!"
            });
        }
    }
}