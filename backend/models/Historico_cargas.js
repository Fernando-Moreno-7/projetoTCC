import { DataTypes } from "sequelize";
import db from "../db/db.js";

import Treino_exercicios from "./Treino_exercicios.js";
import Usuarios from "./Usuarios.js";

const Historico_cargas = db.define(
    "historico_cargas",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        // Carga em quilogramas.
        // Mantém INTEGER conforme a coluna atual do banco.
        peso: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        data_inicial: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },

        // Item do treino ao qual a carga pertence.
        treino_exercicios_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: Treino_exercicios,
                key: "id",
            },

            // Corresponde à restrição atual do MySQL.
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
        },

        // Todo histórico deve identificar seu usuário.
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: Usuarios,
                key: "id",
            },

            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    },
    {
        tableName: "historico_cargas",
        timestamps: false,
    }
);

// Relacionamento com o item do treino.
Historico_cargas.belongsTo(Treino_exercicios, {
    foreignKey: "treino_exercicios_id",
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
});

Treino_exercicios.hasMany(Historico_cargas, {
    foreignKey: "treino_exercicios_id",
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
});

// Relacionamento com o usuário.
Historico_cargas.belongsTo(Usuarios, {
    foreignKey: "usuario_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Usuarios.hasMany(Historico_cargas, {
    foreignKey: "usuario_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

export default Historico_cargas;