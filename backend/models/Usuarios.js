import { DataTypes } from "sequelize";
import db from "../db/db.js";

const Usuarios = db.define(
    "usuarios",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING(100),
            allowNull: false,

            // Impede cadastros com o mesmo e-mail.
            unique: "email",
        },

        // Armazena o hash gerado pelo bcrypt.
        senha: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        data_criacao: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },

        // Peso em quilogramas, com duas casas decimais.
        peso: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },

        // Altura em centímetros inteiros.
        // Exemplo: 175 representa 1,75 metro.
        altura: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        genero: {
            type: DataTypes.TINYINT,
            allowNull: true,
        },

        // IMC calculado pelo controller.
        imc: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },

        idade: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        objetivo: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },

        // Mesmos perfis permitidos no banco.
        tipo_usuario: {
            type: DataTypes.ENUM("aluno", "personal"),
            allowNull: false,
            defaultValue: "aluno",
        },

        telefone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },

        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "Ativo",
        },
    },
    {
        tableName: "usuarios",
        timestamps: false,
    }
);

export default Usuarios;