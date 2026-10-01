// Importa os tipos de dados do Sequelize
// Exemplo: INTEGER, STRING, DATE, DECIMAL...
import { DataTypes } from "sequelize";
// Importa a conexão com o banco de dados
import db from "../db/db.js";
// Define o Model Usuarios
// Esse Model representa a tabela "usuarios" do banco de dados
const Usuarios = db.define(
    "usuarios",
    {

        // ID do usuário
        id: {
            // Define o campo como número inteiro
            type: DataTypes.INTEGER,

            // O campo não pode ser nulo
            allowNull: false,

            // Define o ID como chave primária
            primaryKey: true,

            // Faz o ID ser incrementado automaticamente
            autoIncrement: true,
        },


        // Nome do usuário
        nome: {
            // Texto com até 100 caracteres
            type: DataTypes.STRING(100),

            // Campo obrigatório
            allowNull: false,
        },


        // E-mail do usuário
        email: {
            // Texto com até 100 caracteres
            type: DataTypes.STRING(100),

            // Campo obrigatório
            allowNull: false,
        },


        // Senha do usuário
        senha: {
            // Texto com até 255 caracteres
            type: DataTypes.STRING(255),

            // Campo obrigatório
            allowNull: false,
        },


        // Data de criação do usuário
        data_criacao: {
            // Campo do tipo data
            type: DataTypes.DATE,

            // Pode ser nulo
            allowNull: true,
        },


        // Peso do usuário
        peso: {
            // Campo numérico decimal
            type: DataTypes.DECIMAL(10, 0),

            // Pode ser nulo
            allowNull: true,
        },


        // Altura do usuário
        altura: {
            // Campo do tipo número inteiro
            type: DataTypes.INTEGER,

            // Pode ser nulo
            allowNull: true,
        },


        // Gênero do usuário
        genero: {
            // Número inteiro pequeno
            type: DataTypes.TINYINT,

            // Pode ser nulo
            allowNull: true,
        },


        // IMC do usuário
        imc: {
            // Campo numérico decimal
            type: DataTypes.DECIMAL(10, 0),

            // Pode ser nulo
            allowNull: true,
        },

        // Idade do usuário
        idade: {
            // Número inteiro
            type: DataTypes.INTEGER,

            // Pode ser nulo
            allowNull: true,
        },

        // Objetivo do usuário na academia
        objetivo: {
            // Texto com até 45 caracteres
            type: DataTypes.STRING(45),

            // Pode ser nulo
            allowNull: true,
        },
        // Define o tipo de usuário
        tipo_usuario: {
            // Texto com até 20 caracteres
            type: DataTypes.STRING(20),

            // Não pode ser nulo
            allowNull: false,

            // Caso nenhum valor seja informado,
            // o valor padrão será "aluno"
            defaultValue: "aluno",
        },


        // Telefone do usuário
        telefone: {
            // Texto com até 20 caracteres
            type: DataTypes.STRING(20),

            // Pode ser nulo
            allowNull: true,
        },


        // Status do usuário
        status: {
            // Texto com até 20 caracteres
            type: DataTypes.STRING(20),

            // Não pode ser nulo
            allowNull: false,

            // Caso nenhum status seja informado,
            // o valor padrão será "Ativo"
            defaultValue: "Ativo",
        },
    },

    {
        // Define o nome da tabela no banco de dados
        tableName: "usuarios",

        // Desativa os campos automáticos
        timestamps: false,
    }
);

// Exporta o Model para ser utilizado
export default Usuarios;