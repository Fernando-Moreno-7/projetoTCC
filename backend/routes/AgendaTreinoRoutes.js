import express from "express";

import AgendaTreinoController from "../controllers/AgendaTreinoController.js";

const router = express.Router();


// Criar agendamento
router.post(
    "/create",
    AgendaTreinoController.agendar
);


// Listar todos os agendamentos
router.get(
    "/list",
    AgendaTreinoController.list
);


// Buscar treino do usuário
router.get(
    "/usuario/:usuario_id",
    AgendaTreinoController.getTreinoDoUsuario
);


// Histórico de treinos concluídos do usuário
router.get(
    "/historico/:usuario_id",
    AgendaTreinoController.historico
);


// Buscar agendamento pelo ID
router.get(
    "/:id",
    AgendaTreinoController.getById
);


// Atualizar agendamento
router.post(
    "/update",
    AgendaTreinoController.update
);


// Excluir agendamento
router.delete(
    "/delete",
    AgendaTreinoController.delete
);


// Finalizar treino
router.post(
    "/finalizar",
    AgendaTreinoController.finalizarTreino
);


export default router;