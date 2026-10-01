// Importa os tipos de dados do Sequelize
// Exemplo: INTEGER, STRING, TEXT...
import { DataTypes } from "sequelize";

// Importa a conexão com o banco de dados
import db from "../db/db.js";


// Define o Model Treinos
// Esse Model representa a tabela "treinos" do banco de dados
const Treinos = db.define(
    "treinos",
    {

        // ID do treino
        id: {
            // Define o campo como número inteiro
            type: DataTypes.INTEGER,

            // O campo não pode ser nulo
            allowNull: false,

            // Define o ID como chave primária
            primaryKey: true,

            // Incrementa o ID automaticamente
    
            autoIncrement: true,
        },


        // Nome do treino
        nome: {
            // Texto com até 100 caracteres
            type: DataTypes.STRING(100),

            // O nome é obrigatório
            // e não pode ser nulo
            allowNull: false,
        },


        // Descrição do treino
        descricao: {
            // TEXT permite armazenar textos maiores
            type: DataTypes.TEXT,

            // A descrição é opcional
            // e pode ser nula
            allowNull: true,
        },
    },

    {
        // Define o nome da tabela
        // utilizada no banco de dados
        tableName: "treinos",

        // Desativa os campos automáticos
        // createdAt e updatedAt do Sequelize
        timestamps: false,
    }
);


// Exporta o Model Treinos para que possa
// ser utilizado em outras partes do sistema
export default Treinos;