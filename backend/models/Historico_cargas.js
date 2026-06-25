import { DataTypes } from "sequelize";
import db from "../db/db.js";
import Treino_exercicios from "./Treino_exercicios.js";

const Historico_cargas = db.define(
    "historico_cargas",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        peso: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        data_inicial: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        treino_exercicios_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Treino_exercicios,
                key: "id",
            },
        },
    },
    {
        tableName: "historico_cargas",
        timestamps: false,
    }
);

Historico_cargas.belongsTo(Treino_exercicios, {
    foreignKey: "treino_exercicios_id",
});

Treino_exercicios.hasMany(Historico_cargas, {
    foreignKey: "treino_exercicios_id",
});

export default Historico_cargas;