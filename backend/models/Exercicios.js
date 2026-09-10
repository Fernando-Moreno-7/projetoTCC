import { DataTypes } from "sequelize";
import db from "../db/db.js";

const Exercicios = db.define(
    "exercicios",
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

        grupo_muscular: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        imagem: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: "",
        },

        descricao: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
    },
    {
        tableName: "exercicios",
        timestamps: false,
    }
);

export default Exercicios;