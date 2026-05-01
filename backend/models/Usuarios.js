import {DataTypes} from "sequelize"
import db from "./db/db.js"


const Usuarios = db.define (
    "usuarios",
    {
        id: {
            type: DataTypes.INTEGER, 
            allowNull:false,
            primaryKey:true,
            autoIncrement:true,
        },
        nome: {
            type: DataTypes.STRING(50),
            allowNull:false,

        },
        email: {
            type: DataTypes.STRING(50),
            allowNull:false,
        },
        senha: {
            type: DataTypes.STRING(50),
            allowNull:false,
        },
        data_criacao: {
            type: DataTypes.TIME,
            allowNull:true,
        },
    },
    {
        tableName: "usuarios",
        timestamps: false,
    }

);