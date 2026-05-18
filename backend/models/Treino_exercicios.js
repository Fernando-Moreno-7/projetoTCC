import {DataTypes} from "sequelize"
import db from "./db/db.js"
import Exercicios from "./Exercicios.js"
import Treinos from "./Treinos.js"


const Treino_exercicios = db.define (
    "treino_exercicios",
    {
        id: {
            type: DataTypes.INTEGER, 
            allowNull:false,
            primaryKey:true,
            autoIncrement:true,
        },
        exercicio_id: {
            type: DataTypes.INTEGER, 
            allowNull:false,
            references:{
                model:Exercicios, 
                key: "id",
            },
            onUpdade: "CASCADE",
            onDelete: "CASCADE",
        },
        treino_id: {
            type: DataTypes.INTEGER, 
            allowNull:false,
            references:{
                model:Treinos, 
                key: "id",
            },
            onUpdade: "CASCADE",
            onDelete: "CASCADE",
        },

        series: {
            type: DataTypes.INTEGER,
            allowNull:false,

        },
        repeticoes: {
            type: DataTypes.INTEGER,
            allowNull:false,
        },
    },
    {
        tableName: "treino_exercicios",
        timestamps: false,
    }

);

Treino_exercicios.belongsTo(Exercicios,{
    foreignKey:"usuario_id",
});
Treino_exercicios.belongsTo(Treinos,{
    foreignKey:"treino_id",
});
Exercicios.hasMany(Treino_exercicios,{
    foreignKey:"usuario_id",
});
Treinos.hasMany(Treino_exercicios,{
    foreignKey:"treino_id",
});

export default treino_exercicios;