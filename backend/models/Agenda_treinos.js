// Importa os tipos de dados do Sequelize
import { DataTypes } from "sequelize";

// Importa a conexão com o banco de dados
import db from "../db/db.js";

// Importa os Models que possuem relacionamento com a agenda
import Usuarios from "./Usuarios.js";
import Treinos from "./Treinos.js";


// Define o Model Agenda_treinos
// Representa a tabela "agenda_treinos" do banco de dados
const Agenda_treinos = db.define(
    "agenda_treinos",
    {

        // ID da agenda
        id: {
            // Número inteiro
            type: DataTypes.INTEGER,

            // Não pode ser nulo
            allowNull: false,

            // Define como chave primária
            primaryKey: true,

            // Incrementa o ID automaticamente
            autoIncrement: true,
        },


        // ID do usuário relacionado à agenda
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
                key: "id",
            },

            // Caso a chave referenciada seja atualizada,
            // a referência também será atualizada
            onUpdate: "CASCADE",

            // Caso o usuário seja excluído,
            // os registros dependentes da agenda também serão excluídos
            onDelete: "CASCADE",
        },


        // ID do treino relacionado à agenda
        treino_id: {
            // Número inteiro
            type: DataTypes.INTEGER,

            // Campo obrigatório
            allowNull: false,

            // Define a referência da chave estrangeira
            references: {
                // Referencia o Model Treinos
                model: Treinos,

                // Referencia o campo id de Treinos
                key: "id",
            },

            // Atualiza a referência caso
            // a chave referenciada seja atualizada
            onUpdate: "CASCADE",

            // Exclui os registros dependentes da agenda
            // caso o treino relacionado seja excluído
            onDelete: "CASCADE",
        },


        // Data em que o treino está agendado
        data: {
            // DATEONLY armazena somente a data
            type: DataTypes.DATEONLY,

            // A data é obrigatória
            allowNull: false,
        },


        // Status do treino agendado
        status: {
            // Texto com até 20 caracteres
            type: DataTypes.STRING(20),

            // O status não pode ser nulo
            allowNull: false,

            // Caso nenhum status seja informado,
            // será utilizado "pendente"
            defaultValue: "pendente",
        },
    },

    {
        // Define o nome da tabela no banco de dados
        tableName: "agenda_treinos",

        // Desativa os campos automáticos
        // createdAt e updatedAt
        timestamps: false,
    }
);


// =============================================
// RELACIONAMENTO ENTRE AGENDA E USUÁRIOS
// =============================================

// Uma agenda pertence a um usuário
Agenda_treinos.belongsTo(Usuarios, {
    foreignKey: "usuario_id",
});


// RELACIONAMENTO ENTRE AGENDA E TREINOS


// Uma agenda pertence a um treino
Agenda_treinos.belongsTo(Treinos, {
    foreignKey: "treino_id",
});


// Um usuário pode ter várias agendas
Usuarios.hasMany(Agenda_treinos, {
    foreignKey: "usuario_id",
});


// Um treino pode estar relacionado a várias agendas
Treinos.hasMany(Agenda_treinos, {
    foreignKey: "treino_id",
});


// Exporta o Model para ser utilizado
// em outras partes do sistema
export default Agenda_treinos;