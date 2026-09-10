import Usuarios from "../models/Usuarios.js";
import Logger from "../db/logger.js";
import bcrypt from "bcrypt";
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
            objetivo
        } = req.body;


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


            const salt = await bcrypt.genSalt(12);

            const passwordHash = await bcrypt.hash(
                senha,
                salt
            );


            let imc = null;


            if (peso && altura) {

                imc =
                    peso /
                    (
                        (altura / 100) *
                        (altura / 100)
                    );

                imc = Number(
                    imc.toFixed(2)
                );
            }


            await Usuarios.create({

                nome,

                email,

                senha: passwordHash,

                peso,

                altura,

                genero,

                idade,

                objetivo,

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
            objetivo
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


            // =====================================
            // DADOS QUE SERÃO ATUALIZADOS
            // =====================================

            const dadosAtualizados = {

                nome,

                peso,

                altura,

                genero,

                idade,

                objetivo

            };


            // =====================================
            // ATUALIZAR SENHA SOMENTE SE INFORMADA
            // =====================================

            if (senha || confSenha) {

                if (!senha || !confSenha) {

                    return res.status(422).json({
                        message:
                            "Preencha a nova senha e a confirmação!"
                    });

                }


                if (senha !== confSenha) {

                    return res.status(422).json({
                        message:
                            "As senhas não conferem!"
                    });

                }


                const salt =
                    await bcrypt.genSalt(12);


                const passwordHash =
                    await bcrypt.hash(
                        senha,
                        salt
                    );


                dadosAtualizados.senha =
                    passwordHash;
            }


            // =====================================
            // CALCULAR IMC
            // =====================================

            let imc = null;


            if (peso && altura) {

                imc =
                    peso /
                    (
                        (altura / 100) *
                        (altura / 100)
                    );


                imc = Number(
                    imc.toFixed(2)
                );
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
    // =========================================
    static async deleteUser(req, res) {

        const idUsuario =
            req.body.idUsuario;


        if (!idUsuario) {

            return res.status(422).json({
                message: "Selecione um usuário!"
            });

        }


        try {

            const usuario =
                await Usuarios.findOne({

                    where: {
                        id: idUsuario
                    }

                });


            if (!usuario) {

                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });

            }


            await Agenda_treinos.destroy({

                where: {
                    usuario_id: idUsuario
                }

            });


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


            return res.status(500).json({

                message:
                    "Erro ao excluir usuário!",

                error:
                    error.message

            });

        }
    }


    // =========================================
    // LISTAR USUÁRIOS
    // =========================================
    static async getAllUsers(req, res) {

        try {

            const usuarios =
                await Usuarios.findAll({

                    attributes: {
                        exclude: ["senha"]
                    }

                });


            return res.status(200).json(
                usuarios
            );


        } catch (error) {

            Logger.error(error);


            return res.status(500).json({
                message: "Erro ao buscar usuários!"
            });

        }
    }


    // =========================================
    // BUSCAR USUÁRIO PELO ID
    // =========================================
    static async getUserById(req, res) {

        const idUsuario =
            req.params.id;


        try {

            const usuario =
                await Usuarios.findByPk(

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


            return res.status(200).json(
                usuario
            );


        } catch (error) {

            Logger.error(error);


            return res.status(500).json({
                message: "Erro ao buscar usuário!"
            });

        }
    }

}