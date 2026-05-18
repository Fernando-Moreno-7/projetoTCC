import {DataTypes} from "sequelize"
import db from "./db/db.js"
import Usuarios from "./Usuarios.js"
import Treinos from "./Treinos.js"


const Agenda_treinos = db.define (
    "agenda_treinos",
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

        data: {
            type: DataTypes.DATE,
            allowNull:false,

        },
        status: {
            type: DataTypes.STRING(20),
            allowNull:false,
        },
    },
    {
        tableName: "agenda_treinos",
        timestamps: false,
    }

);

Agenda_treinos.belongsTo(Usuarios,{
    foreignKey:"usuario_id",
});
Agenda_treinos.belongsTo(Treinos,{
    foreignKey:"treino_id",
});
Usuarios.hasMany(Agenda_treinos,{
    foreignKey:"usuario_id",
});
Treinos.hasMany(Agenda_treinos,{
    foreignKey:"treino_id",
});

export default Agenda_treinos;