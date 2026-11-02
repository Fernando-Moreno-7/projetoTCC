import Agenda_treinos from "../models/Agenda_treinos.js";

// Verifica o usuário informado nas rotas:
// /usuario/:usuario_id
// /historico/:usuario_id
export function permitirAcessoAoUsuarioDaAgenda(req, res, next) {

    if (!req.usuario) {
        return res.status(401).json({
            message: "Faça login para continuar!"
        });
    }

    const usuarioId = Number(req.params.usuario_id);

    if (
        !Number.isSafeInteger(usuarioId) ||
        usuarioId <= 0
    ) {
        return res.status(422).json({
            message: "Informe um ID de usuário válido!"
        });
    }

    // O personal pode consultar os agendamentos dos alunos.
    if (req.usuario.tipo_usuario === "personal") {
        return next();
    }

    // O aluno só pode consultar seus próprios dados.
    if (
        req.usuario.tipo_usuario === "aluno" &&
        usuarioId === Number(req.usuario.id)
    ) {
        return next();
    }

    return res.status(403).json({
        message: "Você não pode acessar a agenda de outro usuário!"
    });
}

// Verifica a propriedade do agendamento consultado ou finalizado.
export async function permitirAcessoAoAgendamento(req, res, next) {

    if (!req.usuario) {
        return res.status(401).json({
            message: "Faça login para continuar!"
        });
    }

    // Na consulta, o ID vem da URL.
    // Na finalização, vem do corpo da requisição.
    const agendaId = Number(
        req.method === "GET"
            ? req.params.id
            : req.body?.id
    );

    if (
        !Number.isSafeInteger(agendaId) ||
        agendaId <= 0
    ) {
        return res.status(422).json({
            message: "Informe um ID de agendamento válido!"
        });
    }

    // O personal possui acesso administrativo à agenda.
    if (req.usuario.tipo_usuario === "personal") {
        return next();
    }

    if (req.usuario.tipo_usuario !== "aluno") {
        return res.status(403).json({
            message: "Perfil sem permissão para acessar a agenda!"
        });
    }

    try {

        // Procura o agendamento pelo ID e pelo aluno autenticado.
        // O usuário da requisição não pode escolher o proprietário.
        const agendamento = await Agenda_treinos.findOne({

            where: {
                id: agendaId,
                usuario_id: req.usuario.id
            },

            attributes: ["id", "usuario_id"]

        });

        if (!agendamento) {
            return res.status(404).json({
                message: "Agendamento não encontrado para este usuário!"
            });
        }

        return next();

    } catch {

        return res.status(500).json({
            message: "Erro ao verificar o acesso ao agendamento!"
        });

    }

}