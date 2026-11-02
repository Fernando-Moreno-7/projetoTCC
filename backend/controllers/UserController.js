// Model responsável pelos usuários
import Usuarios from "../models/Usuarios.js";

// Logger utilizado para registrar erros
import Logger from "../db/logger.js";

// Biblioteca utilizada para proteger as senhas
import bcrypt from "bcrypt";

// Model responsável pela agenda de treinos
import Agenda_treinos from "../models/Agenda_treinos.js";

export default class UserController {

    // =========================================
    // CADASTRAR USUÁRIO
    // =========================================

    static async register(req, res) {

        const {
            nome,
            email,
            senha,
            confSenha,
            peso,
            altura,
            genero,
            idade,
            objetivo,
            telefone,
            status
        } = req.body;

        // Valida os campos obrigatórios
        if (!nome) {
            return res.status(422).json({
                message: "O nome de usuário é obrigatório!"
            });
        }

        if (!email) {
            return res.status(422).json({
                message: "O e-mail é obrigatório!"
            });
        }

        if (!senha) {
            return res.status(422).json({
                message: "A senha é obrigatória!"
            });
        }

        if (!confSenha) {
            return res.status(422).json({
                message: "A confirmação da senha é obrigatória!"
            });
        }

        if (senha !== confSenha) {
            return res.status(422).json({
                message: "As senhas não conferem!"
            });
        }

        try {

            // Verifica se o e-mail já está cadastrado
            const usuarioExists = await Usuarios.findOne({
                where: {
                    email
                }
            });

            if (usuarioExists) {
                return res.status(422).json({
                    message: "Este e-mail já foi cadastrado!"
                });
            }

            // Gera o hash da senha
            const salt = await bcrypt.genSalt(12);

            const passwordHash = await bcrypt.hash(
                senha,
                salt
            );

            // Neste cadastro, a altura continua em centímetros
            let imc = null;

            if (peso && altura) {
                imc = peso / (
                    (altura / 100) * (altura / 100)
                );

                imc = Number(imc.toFixed(2));
            }

            // Salva somente os campos definidos aqui
            await Usuarios.create({
                nome,
                email,
                senha: passwordHash,

                // O cadastro não permite criar contas de personal
                tipo_usuario: "aluno",

                peso,
                altura,
                genero,
                idade,
                objetivo,
                telefone: telefone || null,
                status: status || "Ativo",
                imc
            });

            return res.status(200).json({
                message: "Usuário cadastrado com sucesso!"
            });

        } catch (error) {

            Logger.error(error);

            return res.status(500).json({
                message: "Erro ao criar usuário!"
            });

        }

    }

    // =========================================
    // ATUALIZAR USUÁRIO
    // A rota exige o perfil personal
    // =========================================

    static async updateUser(req, res) {

        const {
            nome,
            senha,
            confSenha,
            idUsuario,
            peso,
            altura,
            genero,
            idade,
            objetivo,
            telefone,
            status
        } = req.body;

        if (!idUsuario) {
            return res.status(422).json({
                message: "Selecione um usuário!"
            });
        }

        if (!nome) {
            return res.status(422).json({
                message: "O nome é obrigatório!"
            });
        }

        try {

            const usuario = await Usuarios.findByPk(
                idUsuario
            );

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            // Lista explícita dos campos permitidos.
            // tipo_usuario não pode ser alterado por esta função.
            const dadosAtualizados = {
                nome,
                peso,
                altura,
                genero,
                idade,
                objetivo,
                telefone: telefone || null,
                status: status || "Ativo"
            };

            // Atualiza a senha somente quando informada
            if (senha || confSenha) {

                if (!senha || !confSenha) {
                    return res.status(422).json({
                        message: "Preencha a nova senha e a confirmação!"
                    });
                }

                if (senha !== confSenha) {
                    return res.status(422).json({
                        message: "As senhas não conferem!"
                    });
                }

                const salt = await bcrypt.genSalt(12);

                const passwordHash = await bcrypt.hash(
                    senha,
                    salt
                );

                dadosAtualizados.senha = passwordHash;
            }

            // Recalcula o IMC
            let imc = null;

            if (peso && altura) {
                imc = peso / (
                    (altura / 100) * (altura / 100)
                );

                imc = Number(imc.toFixed(2));
            }

            dadosAtualizados.imc = imc;

            await Usuarios.update(
                dadosAtualizados,
                {
                    where: {
                        id: idUsuario
                    }
                }
            );

            return res.status(200).json({
                message: "Usuário atualizado com sucesso!"
            });

        } catch (error) {

            Logger.error(error);

            return res.status(500).json({
                message: "Erro ao atualizar usuário!"
            });

        }

    }

    // =========================================
    // EXCLUIR USUÁRIO
    // A rota exige o perfil personal
    // =========================================

    static async deleteUser(req, res) {

        const idUsuario = req.body.idUsuario;

        if (!idUsuario) {
            return res.status(422).json({
                message: "Selecione um usuário!"
            });
        }

        try {

            const usuario = await Usuarios.findOne({
                where: {
                    id: idUsuario
                }
            });

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            // Remove os agendamentos relacionados
            await Agenda_treinos.destroy({
                where: {
                    usuario_id: idUsuario
                }
            });

            // Remove o usuário
            await Usuarios.destroy({
                where: {
                    id: idUsuario
                }
            });

            return res.status(200).json({
                message: "Usuário excluído com sucesso!"
            });

        } catch (error) {

            Logger.error(error);

            // Detalhes internos ficam somente no logger
            return res.status(500).json({
                message: "Erro ao excluir usuário!"
            });

        }

    }

    // =========================================
    // LISTAR ALUNOS
    // A rota exige o perfil personal
    // =========================================

    static async getAllUsers(req, res) {

        try {

            const usuarios = await Usuarios.findAll({

                where: {
                    tipo_usuario: "aluno"
                },

                // Não devolve o hash da senha
                attributes: {
                    exclude: ["senha"]
                },

                order: [
                    ["nome", "ASC"]
                ]

            });

            return res.status(200).json(usuarios);

        } catch (error) {

            Logger.error(error);

            return res.status(500).json({
                message: "Erro ao buscar alunos!"
            });

        }

    }

    // =========================================
    // BUSCAR USUÁRIO PELO ID
    // A rota verifica se é personal ou o próprio aluno
    // =========================================

    static async getUserById(req, res) {

        const idUsuario = req.params.id;

        try {

            const usuario = await Usuarios.findByPk(
                idUsuario,
                {
                    attributes: {
                        exclude: ["senha"]
                    }
                }
            );

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            return res.status(200).json(usuario);

        } catch (error) {

            Logger.error(error);

            return res.status(500).json({
                message: "Erro ao buscar usuário!"
            });

        }

    }

}