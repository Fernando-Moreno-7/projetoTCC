// Model responsável pelos usuários
import Usuarios from "../models/Usuarios.js";

// Biblioteca utilizada para gerar e comparar hashes de senha
import bcrypt from "bcrypt";

// Biblioteca utilizada para criar o token JWT
import jwt from "jsonwebtoken";

// Logger utilizado para registrar erros
import Logger from "../db/logger.js";


export default class AuthController {

    // =========================================
    // REALIZAR LOGIN
    // =========================================

    static async login(req, res) {

        // Recebe o e-mail e a senha enviados no corpo da requisição
        const { email, password } = req.body;


        // Verifica se o e-mail foi informado
        if (!email) {

            return res.status(422).json({
                message: "O e-mail é obrigatório!"
            });

        }


        // Verifica se a senha foi informada
        if (!password) {

            return res.status(422).json({
                message: "A senha é obrigatória!"
            });

        }


        try {

            // Procura no banco um usuário com o e-mail informado
            const user = await Usuarios.findOne({

                where: {
                    email
                }

            });


            // Retorna erro caso o usuário não seja encontrado
            if (!user) {

                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });

            }


            // Compara a senha digitada com o hash armazenado no banco
            const senhaValida = await bcrypt.compare(
                password,
                user.senha
            );


            // Caso a senha não corresponda ao hash,
            // interrompe o login e retorna erro
            if (!senhaValida) {

                return res.status(422).json({
                    message: "Senha inválida!"
                });

            }


            // Gera o token JWT após a autenticação do usuário
            const token = jwt.sign(

                {
                    // Informações do usuário adicionadas ao token
                    id_number: user.id,
                    name: user.nome,
                    id: user.email,
                    tipo: user.tipo_usuario
                },

                // Chave secreta utilizada para assinar o token
                // O valor é carregado do arquivo .env
                process.env.JWT_SECRET,

                {
                    // Define o tempo de validade do token
                    expiresIn: "1d"
                }

            );


            // Retorna o token e os dados necessários para o frontend
            return res.status(200).json({

                message: "Login realizado com sucesso!",

                token,

                userId: user.id,

                tipoUsuario: user.tipo_usuario

            });


        } catch (error) {

            // Registra o erro no logger
            Logger.error(
                `Erro ao realizar login: ${error}`
            );


            // Retorna erro interno do servidor
            return res.status(500).json({
                message: "Erro ao realizar login!"
            });

        }

    }

}