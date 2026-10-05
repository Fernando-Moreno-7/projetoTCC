// Importa os tipos de dados do Sequelize
import { DataTypes } from "sequelize";

// Importa a conexão com o banco de dados
import db from "./db/db.js";

// Importa os Models que terão relacionamento com o histórico de treinos
import Usuarios from "./Usuarios.js";
import Treinos from "./Treinos.js";

// Define o Model da tabela historico_treinos
const Historico_treinos = db.define(
    "historico_treinos",
    {
        // ID do registro do histórico
        id: {
            type: DataTypes.INTEGER,
            allowNull: false, // Não pode ser nulo
            primaryKey: true, // Chave primária
            autoIncrement: true, // Incrementado automaticamente
        },

        // ID do usuário que realizou o treino
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            // Chave estrangeira que referencia Usuarios.id
            references: {
                model: Usuarios,
                key: "id",
            },

            // Atualiza a chave estrangeira caso o ID referenciado seja atualizado
            onUpdate: "CASCADE",

            // Exclui os históricos relacionados caso o usuário seja excluído
            onDelete: "CASCADE",
        },

        // ID do treino que foi realizado
        treino_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            // Chave estrangeira que referencia Treinos.id
            references: {
                model: Treinos,
                key: "id",
            },

            // Atualiza a chave estrangeira caso o ID referenciado seja atualizado
            onUpdate: "CASCADE",

            // Exclui os históricos relacionados caso o treino seja excluído
            onDelete: "CASCADE",
        },

        // Data e horário em que o treino foi realizado
        data_realizado: {
            type: DataTypes.DATETIME,
            allowNull: false, // Campo obrigatório
        },

        // Observações relacionadas ao treino realizado
        observacoes: {
            type: DataTypes.TEXT("long"),
            allowNull: false, // Campo obrigatório
        },
    },
    {
        // Nome da tabela no banco de dados
        tableName: "historico_treinos",

        // Não cria createdAt e updatedAt automaticamente
        timestamps: false,
    }
);

// Um registro do histórico pertence a um usuário
Historico_treinos.belongsTo(Usuarios, {
    foreignKey: "usuario_id",
});

// Um registro do histórico pertence a um treino
Historico_treinos.belongsTo(Treinos, {
    foreignKey: "treino_id",
});

// Um usuário pode possuir vários registros no histórico de treinos
Usuarios.hasMany(Historico_treinos, {
    foreignKey: "usuario_id",
});

// Um treino pode possuir vários registros no histórico de treinos
Treinos.hasMany(Historico_treinos, {
    foreignKey: "treino_id",
});

// Exporta o Model
export default Historico_treinos;