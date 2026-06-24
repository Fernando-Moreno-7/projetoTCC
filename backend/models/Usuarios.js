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
        },

        senha: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        data_criacao: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        peso: {
            type: DataTypes.DECIMAL(10, 0),
            allowNull: true,
        },

        altura: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        genero: {
            type: DataTypes.TINYINT,
            allowNull: true,
        },

        imc: {
            type: DataTypes.DECIMAL(10, 0),
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
    },
    {
        tableName: "usuarios",
        timestamps: false,
    }
);

export default Usuarios;