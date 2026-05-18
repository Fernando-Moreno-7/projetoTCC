import {DataTypes, MEDIUMINT} from "sequelize"
import db from "./db/db.js"


const Treinos = db.define (
    "treinos",
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
        descricao: {
            type: DataTypes.TEXT('long'),
            allowNull:true,
        },
        
    },
    {
        tableName: "treinos",
        timestamps: false,
    }

);
export default Treinos;