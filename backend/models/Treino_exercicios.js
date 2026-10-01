// Importa os tipos de dados do Sequelize
import { DataTypes } from "sequelize";

// Importa a conexão com o banco de dados
import db from "../db/db.js";

// Importa os Models que terão relacionamento com treino_exercicios
import Exercicios from "./Exercicios.js";
import Treinos from "./Treinos.js";

// Define o Model da tabela treino_exercicios
const Treino_exercicios = db.define(
    "treino_exercicios",
    {
        // ID do registro
        id: {
            type: DataTypes.INTEGER,
            allowNull: false, // Não pode ser nulo
            primaryKey: true, // Chave primária
            autoIncrement: true, // Incrementado automaticamente
        },

        // ID do exercício relacionado
        exercicio_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            // Chave estrangeira que referencia Exercicios.id
            references: {
                model: Exercicios,
                key: "id",
            },

            // Se o ID do exercício for atualizado,
            // atualiza também nesta tabela
            onUpdate: "CASCADE",

            // Se o exercício for excluído,
            // exclui também os registros relacionados
            onDelete: "CASCADE",
        },

        // ID do treino relacionado
        treino_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            // Chave estrangeira que referencia Treinos.id
            references: {
                model: Treinos,
                key: "id",
            },

            // Se o ID do treino for atualizado,
            // atualiza também nesta tabela
            onUpdate: "CASCADE",

            // Se o treino for excluído,
            // exclui também os registros relacionados
            onDelete: "CASCADE",
        },

        // Quantidade de séries do exercício
        series: {
            type: DataTypes.INTEGER,
            allowNull: false, // Campo obrigatório
        },

        // Quantidade de repetições do exercício
        repeticoes: {
            type: DataTypes.INTEGER,
            allowNull: false, // Campo obrigatório
        },
    },
    {
        // Nome da tabela no banco de dados
        tableName: "treino_exercicios",

        // O Sequelize não criará createdAt e updatedAt automaticamente
        timestamps: false,
    }
);

// Um registro de treino_exercicios pertence a um exercício
Treino_exercicios.belongsTo(Exercicios, {
    foreignKey: "exercicio_id",
});

// Um exercício pode aparecer em vários registros de treino_exercicios
Exercicios.hasMany(Treino_exercicios, {
    foreignKey: "exercicio_id",
});

// Um registro de treino_exercicios pertence a um treino
Treino_exercicios.belongsTo(Treinos, {
    foreignKey: "treino_id",
});

// Um treino pode possuir vários registros em treino_exercicios
Treinos.hasMany(Treino_exercicios, {
    foreignKey: "treino_id",
});

// Exporta o Model para ser utilizado em outras partes do backend
export default Treino_exercicios;