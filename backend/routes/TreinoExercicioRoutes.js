import express from "express";

import TreinoExercicioController from "../controllers/TreinoExercicioController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

import {
    permitirPerfis
} from "../middlewares/autorizacaoMiddleware.js";

const router = express.Router();

// Exige autenticação em todas as rotas.
router.use(authMiddleware);

// Adicionar exercício ao treino: somente personal.
router.post(
    "/add",
    permitirPerfis("personal"),
    TreinoExercicioController.add
);

// Consultar os exercícios dos treinos.
// O controller deverá restringir os resultados para alunos.
router.get(
    "/list",
    TreinoExercicioController.list
);

// Alterar exercício do treino: somente personal.
router.post(
    "/update",
    permitirPerfis("personal"),
    TreinoExercicioController.update
);

// Remover exercício do treino: somente personal.
router.delete(
    "/delete",
    permitirPerfis("personal"),
    TreinoExercicioController.delete
);

export default router;