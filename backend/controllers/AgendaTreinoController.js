import Agenda_treinos from "../models/Agenda_treinos.js";
import Logger from "../db/logger.js";
import Usuarios from "../models/Usuarios.js";
import Treinos from "../models/Treinos.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
import Exercicios from "../models/Exercicios.js";

export default class AgendaTreinoController {

    static async agendar(req, res) {

        const { usuario_id, treino_id, data, status } = req.body;
         const usuario = await Usuarios.findByPk(usuario_id);
    const treino = await Treinos.findByPk(treino_id);

    if (!usuario || !treino) {
        return res.status(404).json({
            message: "Usuário ou treino não existe!"
        });
    }

    try {

        await Agenda_treinos.create({
            usuario_id,
            treino_id,
            data,
            status: status || "pendente"
        });

        return res.status(200).json({
            message: "Treino agendado com sucesso!"
        });

    } catch (error) {

        return res.status(500).json({
            message: "Erro ao agendar treino!"
        });
    }

        if (!usuario_id || !treino_id || !data) {
            return res.status(422).json({
                message: "Preencha usuario, treino e data!"
            });
        }

        try {

            await Agenda_treinos.create({
                usuario_id,
                treino_id,
                data,
                status: status || "pendente"
            });

            return res.status(200).json({
                message: "Treino agendado com sucesso!"
            });

        } catch (error) {

            Logger.error(error);

            return res.status(500).json({
                message: "Erro ao agendar treino!"
            });
        }
    }
    static async list(req, res) {

    try {

        const agenda = await Agenda_treinos.findAll();

        return res.status(200).json(agenda);

    } catch (error) {

        Logger.error(error);

        return res.status(500).json({
            message: "Erro ao listar agenda!"
        });
    }
}
static async list(req, res) {

    try {

        const agenda = await Agenda_treinos.findAll();

        return res.status(200).json(agenda);

    } catch (error) {

        Logger.error(error);

        return res.status(500).json({
            message: "Erro ao listar agenda!"
        });
    }
}
static async getById(req, res) {

    const id = req.params.id;

    try {

        const item = await Agenda_treinos.findByPk(id);

        if (!item) {
            return res.status(404).json({
                message: "Agendamento não encontrado!"
            });
        }

        return res.status(200).json(item);

    } catch (error) {

        Logger.error(error);

        return res.status(500).json({
            message: "Erro ao buscar agenda!"
        });
    }
}
static async update(req, res) {

    const { id, status } = req.body;

    try {

        await Agenda_treinos.update(
            { status },
            { where: { id } }
        );

        return res.status(200).json({
            message: "Agenda atualizada!"
        });

    } catch (error) {

        Logger.error(error);

        return res.status(500).json({
            message: "Erro ao atualizar agenda!"
        });
    }
}
static async delete(req, res) {

    const { id } = req.body;

    try {

        await Agenda_treinos.destroy({
            where: { id }
        });

        return res.status(200).json({
            message: "Agendamento removido!"
        });

    } catch (error) {

        Logger.error(error);

        return res.status(500).json({
            message: "Erro ao remover agenda!"
        });
    }
}
static async getTreinoDoUsuario(req, res) {

    const { usuario_id } = req.params;

    try {

        const agenda = await Agenda_treinos.findOne({
            where: {
                usuario_id
            }
        });

        if (!agenda) {
            return res.status(404).json({
                message: "Usuário não possui treino cadastrado!"
            });
        }

        const treino = await Treinos.findByPk(agenda.treino_id);

        const treinoExercicios = await Treino_exercicios.findAll({
            where: {
                treino_id: treino.id
            },
            include: [
                {
                    model: Exercicios
                }
            ]
        });

        return res.status(200).json({
            treino,
            exercicios: treinoExercicios
        });

    } catch (error) {

        Logger.error(error);

        return res.status(500).json({
            message: "Erro ao buscar treino do usuário!"
        });

    }

}

}