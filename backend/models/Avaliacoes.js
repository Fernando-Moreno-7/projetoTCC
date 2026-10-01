// Importa os tipos de dados do Sequelize
import { DataTypes } from "sequelize";

// Importa a conexão com o banco de dados
import db from "../db/db.js";

// Importa o Model Usuarios para criar
// o relacionamento entre avaliações e usuários
import Usuarios from "./Usuarios.js";


// Define o Model Avaliacoes
// Representa a tabela "avaliacoes" do banco de dados
const Avaliacoes = db.define(
    "avaliacoes",
    {

        // ID da avaliação
        id: {
            // Número inteiro
            type: DataTypes.INTEGER,

            // Não pode ser nulo
            allowNull: false,

            // Define o ID como chave primária
            primaryKey: true,

            // Incrementa o ID automaticamente
            autoIncrement: true
        },


        // ID do usuário relacionado à avaliação
        usuario_id: {
            // Número inteiro
            type: DataTypes.INTEGER,

            // Campo obrigatório
            allowNull: false,

            // Define a referência da chave estrangeira
            references: {
                // Referencia o Model Usuarios
                model: Usuarios,

                // Referencia o campo id de Usuarios
                key: "id"
            },

            // Se a chave referenciada for atualizada,
            // a referência também será atualizada
            onUpdate: "CASCADE",

            // Se o usuário relacionado for excluído,
            // suas avaliações também serão excluídas
            onDelete: "CASCADE"
        },


        // Peso registrado na avaliação
        peso: {
            // Número decimal
            // com duas casas decimais
            type: DataTypes.DECIMAL(6, 2),

            // O peso é obrigatório
            allowNull: false
        },


        // Altura registrada na avaliação
        altura: {
            // Número decimal
            // com duas casas decimais
            type: DataTypes.DECIMAL(4, 2),

            // A altura é obrigatória
            allowNull: false
        },


        // IMC calculado na avaliação
        imc: {
            // Número decimal
            // com duas casas decimais
            type: DataTypes.DECIMAL(5, 2),

            // O IMC é obrigatório
            allowNull: false
        },


        // Data em que a avaliação foi realizada
        data_avaliacao: {
            // DATEONLY armazena somente a data,
            // sem horário
            type: DataTypes.DATEONLY,

            // A data da avaliação é obrigatória
            allowNull: false
        },


        // Observações adicionais da avaliação
        observacoes: {
            // Permite armazenar texto
            type: DataTypes.TEXT,

            // As observações são opcionais
            // e podem ser nulas
            allowNull: true
        }
    },

    {
        // Define o nome da tabela no banco de dados
        tableName: "avaliacoes",

        // Desativa o gerenciamento automático
        // dos campos createdAt e updatedAt
        timestamps: false
    }
);


// =============================================
// RELACIONAMENTO ENTRE AVALIAÇÕES E USUÁRIOS
// =============================================

// Uma avaliação pertence a um usuário
Avaliacoes.belongsTo(
    Usuarios,
    {
        // Define usuario_id como chave estrangeira
        foreignKey: "usuario_id"
    }
);


// Um usuário pode ter várias avaliações
Usuarios.hasMany(
    Avaliacoes,
    {
        // Define usuario_id como chave estrangeira
        foreignKey: "usuario_id"
    }
);


// Exporta o Model para ser utilizado
// em outras partes do sistema
export default Avaliacoes;