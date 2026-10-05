// Importa os tipos de dados do Sequelize
import { DataTypes } from "sequelize";

// Importa a conexão com o banco de dados
import db from "../db/db.js";

// Importa o Model Treino_exercicios para criar o relacionamento
import Treino_exercicios from "./Treino_exercicios.js";

// Define o Model da tabela historico_cargas
const Historico_cargas = db.define(
    "historico_cargas",
    {
        // ID do registro do histórico de carga
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

        // ID que relaciona o histórico com treino_exercicios
        treino_exercicios_id: {
            type: DataTypes.INTEGER,
            allowNull: false, 

           
            references: {
                model: Treino_exercicios,
                key: "id",
            },
        },

       
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: true, // Pode ser nulo
        },
    },
    {
        // Nome da tabela no banco de dados
        tableName: "historico_cargas",

        // Não cria createdAt e updatedAt automaticamente
        timestamps: false,
    }
);

// Cada registro de histórico de cargas
// pertence a um registro de treino_exercicios
Historico_cargas.belongsTo(
    Treino_exercicios,
    {
        foreignKey: "treino_exercicios_id",
    }
);

// Um registro de treino_exercicios pode possuir
// vários registros no histórico de cargas
Treino_exercicios.hasMany(
    Historico_cargas,
    {
        foreignKey: "treino_exercicios_id",
    }
);

// Exporta o Model para ser utilizado em outras partes do backend
export default Historico_cargas;