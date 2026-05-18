import {DataTypes, MEDIUMINT} from "sequelize"
import db from "./db/db.js"


const Exercicios = db.define (
    "exercicios",
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
        grupo_muscular: {
            type: DataTypes.STRING(25),
            allowNull:false,
        },
        
    },
    {
        tableName: "exercicios",
        timestamps: false,
    }

);
export default Exercicios;