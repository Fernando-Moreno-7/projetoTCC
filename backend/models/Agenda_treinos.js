import { DataTypes } from "sequelize";
import db from "../db/db.js";

import Usuarios from "./Usuarios.js";
import Treinos from "./Treinos.js";

const Agenda_treinos = db.define(
    "agenda_treinos",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        // Usuário ao qual o agendamento pertence.
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: Usuarios,
                key: "id",
            },

            // Mantém as restrições existentes no MySQL.
            // O controller remove os dependentes quando necessário.
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        },

        // Treino selecionado para o agendamento.
        treino_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: Treinos,
                key: "id",
            },

            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        },

        // Data sem horário.
        data: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        // Mesmos valores permitidos na coluna do MySQL.
        status: {
            type: DataTypes.ENUM("pendente", "concluido"),
            allowNull: false,
            defaultValue: "pendente",
        },
    },
    {
        tableName: "agenda_treinos",
        timestamps: false,
    }
);

// Cada agendamento pertence a um usuário.
Agenda_treinos.belongsTo(Usuarios, {
    foreignKey: "usuario_id",
    onUpdate: "RESTRICT",
    onDelete: "RESTRICT",
});

// Cada agendamento referencia um treino.
Agenda_treinos.belongsTo(Treinos, {
    foreignKey: "treino_id",
    onUpdate: "RESTRICT",
    onDelete: "RESTRICT",
});

// Um usuário pode possuir vários agendamentos.
Usuarios.hasMany(Agenda_treinos, {
    foreignKey: "usuario_id",
    onUpdate: "RESTRICT",
    onDelete: "RESTRICT",
});

// Um treino pode aparecer em vários agendamentos.
Treinos.hasMany(Agenda_treinos, {
    foreignKey: "treino_id",
    onUpdate: "RESTRICT",
    onDelete: "RESTRICT",
});

export default Agenda_treinos;