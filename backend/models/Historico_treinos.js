import {DataTypes} from "sequelize"
import db from "./db/db.js"
import Usuarios from "./Usuarios.js"
import Treinos from "./Treinos.js"


const Historico_treinos = db.define (
    "historico_treinos",
    {
        id: {
            type: DataTypes.INTEGER, 
            allowNull:false,
            primaryKey:true,
            autoIncrement:true,
        },
        usuario_id: {
            type: DataTypes.INTEGER, 
            allowNull:false,
            references:{
                model:Usuarios, 
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

        data_realizado: {
            type: DataTypes.DATETIME,
            allowNull:false,

        },
        observacoes: {
            type: DataTypes.TEXT('long'),
            allowNull:false,
        },
    },
    {
        tableName: "historico_treinos",
        timestamps: false,
    }

);

Historico_treinos.belongsTo(Usuarios,{
    foreignKey:"usuario_id",
});
Historico_treinos.belongsTo(Treinos,{
    foreignKey:"treino_id",
});
Usuarios.hasMany(Historico_treinos,{
    foreignKey:"usuario_id",
});
Treinos.hasMany(Historico_treinos,{
    foreignKey:"treino_id",
});

export default Historico_treinos;