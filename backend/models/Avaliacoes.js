import { DataTypes } from "sequelize";
import db from "../db/db.js";
import Usuarios from "./Usuarios.js";


const Avaliacoes = db.define(
    "avaliacoes",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Usuarios,
                key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        },

        peso: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false
        },

        altura: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: false
        },

        imc: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },

        data_avaliacao: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        observacoes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: "avaliacoes",
        timestamps: false
    }
);


Avaliacoes.belongsTo(
    Usuarios,
    {
        foreignKey: "usuario_id"
    }
);


Usuarios.hasMany(
    Avaliacoes,
    {
        foreignKey: "usuario_id"
    }
);


export default Avaliacoes;