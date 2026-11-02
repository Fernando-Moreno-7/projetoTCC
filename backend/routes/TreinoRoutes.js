import express from "express";

import TreinoController from "../controllers/TreinoController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

import {
    permitirPerfis
} from "../middlewares/autorizacaoMiddleware.js";

const router = express.Router();

// Exige autenticação em todas as rotas de treinos.
router.use(authMiddleware);

// Criar treino: somente personal.
router.post(
    "/create",
    permitirPerfis("personal"),
    TreinoController.createTreino
);

// Listar treinos.
// O controller deverá limitar os resultados para alunos.
router.get(
    "/list",
    TreinoController.getAllTreinos
);

// Buscar treino pelo ID.
// O controller deverá verificar o vínculo com o aluno.
router.get(
    "/:id",
    TreinoController.getTreinoById
);

// Atualizar treino: somente personal.
router.post(
    "/update",
    permitirPerfis("personal"),
    TreinoController.updateTreino
);

// Excluir treino: somente personal.
router.delete(
    "/delete",
    permitirPerfis("personal"),
    TreinoController.deleteTreino
);

export default router;