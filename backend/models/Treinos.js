import { DataTypes } from "sequelize";
import db from "../db/db.js";

const Treinos = db.define(
    "treinos",
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

        descricao: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: "treinos",
        timestamps: false,
    }
);

export default Treinos;