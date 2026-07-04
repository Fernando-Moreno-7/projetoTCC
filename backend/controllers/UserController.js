import Usuarios from "../models/Usuarios.js"
import Logger from "../db/logger.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import sequelize from "../db/db.js"
import getToken from "../helpers/get-token.js"
import Agenda_treinos from "../models/Agenda_treinos.js";


export default class UserController {
    // FUNÇÕES DO ALUNO

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

        if (!nome) return res.status(422).json({ message: "O nome de usuario é obrigatorio" });
        if (!email) return res.status(422).json({ message: "O email é obrigatório!" });
        if (!senha) return res.status(422).json({ message: "A senha é obrigatório!" });
        if (!confSenha) return res.status(422).json({ message: "A confirmação da senha é obrigatório!" });
        if (senha != confSenha) return res.status(422).json({ message: "Por favor coloque senhas iguais!" });

        const usuarioExists = await Usuarios.findOne({ where: { email } });
        if (usuarioExists) {
            return res.status(422).json({ message: "Este email já foi cadastrado!" });
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(senha, salt);

        let imc = null;
        if (peso && altura) {
            imc = peso / ((altura / 100) * (altura / 100));
            imc = Number(imc.toFixed(2));
        }

        try {
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

            return res.status(200).json({ message: "Usuário cadastrado com sucesso!" });

        } catch (error) {
            Logger.error(error);
            return res.status(500).json({ message: "Erro ao criar usuário!" });
        }
    }

    static async updateUser(req, res) {
        // FUNÇÕES DO ALUNO

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

        if (!idUsuario) return res.status(422).json({ message: "Selecione um usuário!" });
        if (!nome) return res.status(422).json({ message: "O nome é obrigatório" });
        if (!senha) return res.status(422).json({ message: "A senha é obrigatória" });
        if (!confSenha) return res.status(422).json({ message: "Confirmação obrigatória" });
        if (senha !== confSenha) return res.status(422).json({ message: "Senhas não conferem" });

        const usuario = await Usuarios.findByPk(idUsuario);
        if (!usuario) return res.status(404).json({ message: "Usuário não encontrado!" });

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(senha, salt);

        // FUNÇÕES DO PERSONAL

        let imc = null;
        if (peso && altura) {
            imc = peso / ((altura / 100) * (altura / 100));
            imc = Number(imc.toFixed(2));
        }

        try {
            await Usuarios.update(
                {
                    nome,
                    senha: passwordHash,
                    peso,
                    altura,
                    genero,
                    idade,
                    objetivo,
                    imc
                },
                { where: { id: idUsuario } }
            );

            return res.status(200).json({ message: "Usuário atualizado com sucesso!" });

        } catch (error) {
            Logger.error(error);
            return res.status(500).json({ message: "Erro ao atualizar usuário!" });
        }
    }

    static async deleteUser(req, res) {
        // FUNÇÕES DO PERSONAL

        const idUsuario = req.body.idUsuario;

        if (!idUsuario) {
            return res.status(422).json({ message: "Selecione um usuário!" });
        }

        try {

            const usuario = await Usuarios.findOne({ where: { id: idUsuario } });

            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado!" });
            }

            await Agenda_treinos.destroy({
                where: { usuario_id: idUsuario }
            });

            await Usuarios.destroy({
                where: { id: idUsuario }
            });

            return res.status(200).json({ message: "Usuário excluído com sucesso!" });

        } catch (error) {
            Logger.error(error);

            return res.status(500).json({
                message: "Erro ao excluir usuário!",
                error: error.message
            });
        }
    }

    static async getAllUsers(req, res) {
        // FUNÇÕES DO PERSONAL
        try {
            const usuarios = await Usuarios.findAll({
                attributes: { exclude: ["senha"] }
            });

            return res.status(200).json(usuarios);

        } catch (error) {
            Logger.error(error);
            return res.status(500).json({ message: "Erro ao buscar usuários!" });
        }
    }

    static async getUserById(req, res) {
        // FUNÇÕES DO PERSONAL

        const idUsuario = req.params.id;

        try {

            const usuario = await Usuarios.findByPk(idUsuario, {
                attributes: { exclude: ["senha"] }
            });

            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado!" });
            }

            return res.status(200).json(usuario);

        } catch (error) {
            Logger.error(error);
            return res.status(500).json({ message: "Erro ao buscar usuário!" });
        }
    }
}