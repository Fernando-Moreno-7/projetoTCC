import Usuarios from "../models/Usuarios.js"
import Logger from "../db/logger.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import sequelize from "../db/db.js"
import getToken from "../helpers/get-token.js"


export default class UserController {
    static async register(req, res) {
        const { nome, email, senha, confSenha, } = req.body;

        // validations
        if (!nome) {
            res.status(422).json({ message: "O nome de usuario é obrigatorio" });
            return;
        }

        if (!email) {
            res.status(422).json({ message: "O email é obrigatório!" });
            return;
        }
        if (!senha) {
            res.status(422).json({ message: "A senha é obrigatório!" });
            return;
        }

        if (!confSenha) {
            res.status(422).json({ message: "A confirmação da senha é obrigatório!" });
            return;
        }
        if (senha != confSenha) {
            res.status(422).json({ message: "Por favor coloque senhas iguais!" });
            return;
        }



        // check if turma exists
        const usuarioExists = await Usuarios.findOne({ where: { email: email } });
        if (usuarioExists) {
            res.status(422).json({
                message: "Por favor, utilize outro email. Este já foi cadastrado!",
            });
            return;
        }
        // create hash password 
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(senha, salt);
       
       
        const usuarios = new Usuarios({
            nome: nome,
            email: email,
            senha: passwordHash,
        });

        // save turma on db
        try {
            const newUsuarios = await usuarios.save();
            res.status(200).json({ message: "O seu usuario foi cadastrado com sucesso!" });
        } catch (error) {
            Logger.error(`Erro ao criar um usuario no banco: ${error}`);
            res.status(500).json({ message: "Erro ao criar um usuario no banco!" });
        }
    }
    
    static async updateUser (req, res){
        const nome = req.body.nome;
        const senha = req.body.senha;
        const confSenha = req.body.confSenha;
        const idUsuario = req.body.idUsuario
        if (!nome) {
            res.status(422).json({ message: "O nome é obrigatorio  " });
            return;
        }
         if (!senha) {
            res.status(422).json({ message: "A senha é obrigatoria" });
            return;
        }
         if (!confSenha) {
            res.status(422).json({ message: "A confirmação da senha é obrigatoria" });
            return;
        }
        if(senha != confSenha){
            res.status(422).json({ message: "A senhas não são iguais" });
            return;
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(senha, salt);

        try {
            const uptadeUsuarios = await Usuarios.update(
                {
                    nome: nome,
                    senha: passwordHash,
                },
                {
                    where: {id:  idUsuario},
                }
            );
            
            res.status(200).json({ message: "O seu usuario foi atualizado com sucesso!" });
        } catch (error) {
            Logger.error(`Erro ao atualizar o usuario no banco: ${error}`);
            res.status(500).json({ message: "Erro ao atualizar o usuario no banco!" });
        }
    }
}

