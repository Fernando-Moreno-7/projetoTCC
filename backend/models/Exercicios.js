// Importa os tipos de dados do Sequelize
// Exemplo: INTEGER, STRING, TEXT...
import { DataTypes } from "sequelize";

// Importa a conexão com o banco de dados
import db from "../db/db.js";


// Define o Model Exercicios
// Esse Model representa a tabela "exercicios" do banco de dados
const Exercicios = db.define(
    "exercicios",
    {

        // ID do exercício
        id: {
            // Define o campo como número inteiro
            type: DataTypes.INTEGER,

            // O campo não pode ser nulo
            allowNull: false,

            // Define o ID como chave primária
            primaryKey: true,

            // Incrementa o ID automaticamente
            // Exemplo: 1, 2, 3, 4...
            autoIncrement: true,
        },


        // Nome do exercício
        nome: {
            // Texto com até 100 caracteres
            type: DataTypes.STRING(100),

            // O nome é obrigatório
            allowNull: false,
        },


        // Grupo muscular trabalhado pelo exercício
        grupo_muscular: {
            // Texto com até 50 caracteres
            type: DataTypes.STRING(50),

            // O grupo muscular é obrigatório
            allowNull: false,
        },


        // Imagem relacionada ao exercício
        imagem: {
            // Texto com até 100 caracteres
            type: DataTypes.STRING(100),

            // O campo não pode ser nulo
            allowNull: false,

            // Caso nenhuma imagem seja informada,
            // será utilizada uma string vazia
            defaultValue: "",
        },


        // Descrição do exercício
        descricao: {
            // Permite armazenar um texto maior
            type: DataTypes.TEXT("long"),

            // A descrição é obrigatória
            allowNull: false,
        },
    },

    {
        // Define o nome da tabela no banco de dados
        tableName: "exercicios",

        // Desativa o gerenciamento automático
        // dos campos createdAt e updatedAt
        timestamps: false,
    }
);


// Exporta o Model Exercicios para ser utilizado
// em outras partes do sistema
export default Exercicios;