import express from "express";

import ExercicioController from "../controllers/ExercicioController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

import {
    permitirPerfis
} from "../middlewares/autorizacaoMiddleware.js";

const router = express.Router();

// Exige autenticação em todas as rotas.
router.use(authMiddleware);

// Criar exercício: somente personal.
router.post(
    "/create",
    permitirPerfis("personal"),
    ExercicioController.createExercicio
);

// Consultar o catálogo de exercícios.
router.get(
    "/list",
    permitirPerfis("personal", "aluno"),
    ExercicioController.getAllExercicios
);

// Consultar um exercício pelo ID.
router.get(
    "/:id",
    permitirPerfis("personal", "aluno"),
    ExercicioController.getExercicioById
);

// Atualizar exercício: somente personal.
router.post(
    "/update",
    permitirPerfis("personal"),
    ExercicioController.updateExercicio
);

// Excluir exercício: somente personal.
router.delete(
    "/delete",
    permitirPerfis("personal"),
    ExercicioController.deleteExercicio
);

export default router;