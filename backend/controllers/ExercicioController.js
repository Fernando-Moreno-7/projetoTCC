import Exercicios from "../models/Exercicios.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
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

// Confere a identificação adicionada pelo middleware JWT.
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

// Restringe as alterações no catálogo ao personal.
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

// Valida os campos de cadastro e atualização.
function validarDados(body, res) {
    const {
        nome,
        grupo_muscular,
        imagem,
        descricao
    } = body || {};

    if (typeof nome !== "string" || !nome.trim()) {
        res.status(422).json({
            message: "O nome do exercício é obrigatório!"
        });
        return null;
    }

    if (
        typeof grupo_muscular !== "string" ||
        !grupo_muscular.trim()
    ) {
        res.status(422).json({
            message: "O grupo muscular é obrigatório!"
        });
        return null;
    }

    if (
        typeof descricao !== "string" ||
        !descricao.trim()
    ) {
        res.status(422).json({
            message: "A descrição é obrigatória!"
        });
        return null;
    }

    if (
        imagem !== undefined &&
        imagem !== null &&
        typeof imagem !== "string"
    ) {
        res.status(422).json({
            message: "A imagem deve ser informada como texto!"
        });
        return null;
    }

    return {
        nome: nome.trim(),
        grupo_muscular: grupo_muscular.trim(),
        descricao: descricao.trim(),
        imagem: imagem == null ? undefined : imagem.trim()
    };
}

export default class ExercicioController {

    // Cadastrar exercício: somente personal.
    static async createExercicio(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const dados = validarDados(req.body, res);

        if (!dados) {
            return;
        }

        try {
            await Exercicios.create({
                nome: dados.nome,
                grupo_muscular: dados.grupo_muscular,
                imagem: dados.imagem ?? "",
                descricao: dados.descricao
            });

            return res.status(201).json({
                message: "Exercício cadastrado com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao criar exercício: ${error}`);

            return res.status(500).json({
                message: "Erro ao criar exercício!"
            });
        }
    }

    // Listar o catálogo para usuários autenticados.
    static async getAllExercicios(req, res) {
        if (!verificarSessao(req, res)) {
            return;
        }

        try {
            const exercicios = await Exercicios.findAll({
                order: [
                    ["nome", "ASC"]
                ]
            });

            return res.status(200).json(exercicios);

        } catch (error) {
            Logger.error(`Erro ao buscar exercícios: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar exercícios!"
            });
        }
    }

    // Consultar um exercício do catálogo.
    static async getExercicioById(req, res) {
        if (!verificarSessao(req, res)) {
            return;
        }

        const idExercicio = req.params.id;

        if (!idValido(idExercicio)) {
            return res.status(422).json({
                message: "Informe um ID de exercício válido!"
            });
        }

        try {
            const exercicio = await Exercicios.findByPk(
                Number(idExercicio)
            );

            if (!exercicio) {
                return res.status(404).json({
                    message: "Exercício não encontrado!"
                });
            }

            return res.status(200).json(exercicio);

        } catch (error) {
            Logger.error(`Erro ao buscar exercício: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar exercício!"
            });
        }
    }

    // Atualizar exercício: somente personal.
    static async updateExercicio(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const { idExercicio } = req.body || {};

        if (!idValido(idExercicio)) {
            return res.status(422).json({
                message: "Selecione um exercício válido!"
            });
        }

        const dados = validarDados(req.body, res);

        if (!dados) {
            return;
        }

        try {
            const exercicio = await Exercicios.findByPk(
                Number(idExercicio)
            );

            if (!exercicio) {
                return res.status(404).json({
                    message: "Exercício não encontrado!"
                });
            }

            await exercicio.update({
                nome: dados.nome,
                grupo_muscular: dados.grupo_muscular,
                descricao: dados.descricao,

                // Sem nova imagem, mantém a anterior.
                // Uma string vazia permite remover a imagem.
                imagem: dados.imagem ?? exercicio.imagem ?? ""
            });

            return res.status(200).json({
                message: "Exercício atualizado com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao atualizar exercício: ${error}`);

            return res.status(500).json({
                message: "Erro ao atualizar exercício!"
            });
        }
    }

    // Excluir exercício: somente personal.
    static async deleteExercicio(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const { idExercicio } = req.body || {};

        if (!idValido(idExercicio)) {
            return res.status(422).json({
                message: "Selecione um exercício válido!"
            });
        }

        try {
            const exercicio = await Exercicios.findByPk(
                Number(idExercicio)
            );

            if (!exercicio) {
                return res.status(404).json({
                    message: "Exercício não encontrado!"
                });
            }

            const exercicioEmTreino =
                await Treino_exercicios.findOne({
                    where: {
                        exercicio_id: exercicio.id
                    }
                });

            if (exercicioEmTreino) {
                return res.status(409).json({
                    message:
                        "Este exercício está sendo utilizado em um treino. Remova-o dos treinos antes de excluí-lo!"
                });
            }

            await exercicio.destroy();

            return res.status(200).json({
                message: "Exercício excluído com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao excluir exercício: ${error}`);

            // Trata um vínculo criado entre a consulta e a exclusão,
            // quando o banco possui a chave estrangeira correspondente.
            if (error.name === "SequelizeForeignKeyConstraintError") {
                return res.status(409).json({
                    message:
                        "O exercício possui registros vinculados e não pode ser excluído!"
                });
            }

            return res.status(500).json({
                message: "Erro ao excluir exercício!"
            });
        }
    }
}