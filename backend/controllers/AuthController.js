import Usuarios from "../models/Usuarios.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Logger from "../db/logger.js";


export default class AuthController {

    static async login(req, res) {

        const { email, password } = req.body;


        if (!email) {

            return res.status(422).json({
                message: "O e-mail é obrigatório!"
            });

        }


        if (!password) {

            return res.status(422).json({
                message: "A senha é obrigatória!"
            });

        }


        try {

            const user = await Usuarios.findOne({
                where: {
                    email
                }
            });


            if (!user) {

                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });

            }


            const senhaValida = await bcrypt.compare(
                password,
                user.senha
            );


            if (!senhaValida) {

                return res.status(422).json({
                    message: "Senha inválida!"
                });

            }


            const token = jwt.sign(
                {
                    id_number: user.id,
                    name: user.nome,
                    id: user.email,
                    tipo: user.tipo_usuario
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );


            return res.status(200).json({

                message: "Login realizado com sucesso!",

                token,

                userId: user.id

            });


        } catch (error) {

            Logger.error(
                `Erro ao realizar login: ${error}`
            );


            return res.status(500).json({
                message: "Erro ao realizar login!"
            });

        }

    }

}