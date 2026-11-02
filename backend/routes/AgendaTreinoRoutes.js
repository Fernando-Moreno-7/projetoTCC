import express from "express";

import AgendaTreinoController
    from "../controllers/AgendaTreinoController.js";

import {
    permitirPerfis
} from "../middlewares/autorizacaoMiddleware.js";

import {
    permitirAcessoAoUsuarioDaAgenda,
    permitirAcessoAoAgendamento
} from "../middlewares/agendaAutorizacaoMiddleware.js";

const router = express.Router();

// Somente o personal pode criar agendamentos.
router.post(
    "/create",
    permitirPerfis("personal"),
    AgendaTreinoController.agendar
);

// Somente o personal pode listar todos os agendamentos.
router.get(
    "/list",
    permitirPerfis("personal"),
    AgendaTreinoController.list
);

// Personal pode consultar os alunos.
// Aluno pode consultar somente o próprio treino.
router.get(
    "/usuario/:usuario_id",
    permitirAcessoAoUsuarioDaAgenda,
    AgendaTreinoController.getTreinoDoUsuario
);

// Personal pode consultar os alunos.
// Aluno pode consultar somente o próprio histórico.
router.get(
    "/historico/:usuario_id",
    permitirAcessoAoUsuarioDaAgenda,
    AgendaTreinoController.historico
);

// Personal consulta qualquer agendamento.
// Aluno consulta somente um agendamento que lhe pertence.
router.get(
    "/:id",
    permitirAcessoAoAgendamento,
    AgendaTreinoController.getById
);

// Somente o personal pode editar agendamentos.
router.post(
    "/update",
    permitirPerfis("personal"),
    AgendaTreinoController.update
);

// Somente o personal pode excluir agendamentos.
router.delete(
    "/delete",
    permitirPerfis("personal"),
    AgendaTreinoController.delete
);

// Personal possui acesso administrativo.
// Aluno só pode finalizar um agendamento próprio.
router.post(
    "/finalizar",
    permitirAcessoAoAgendamento,
    AgendaTreinoController.finalizarTreino
);

export default router;