import express from "express";
import AvaliacaoController from "../controllers/AvaliacaoController.js";


const router = express.Router();


// CRIAR AVALIAÇÃO
router.post(
    "/create",
    AvaliacaoController.create
);


// LISTAR TODAS AS AVALIAÇÕES
router.get(
    "/list",
    AvaliacaoController.list
);


// LISTAR AVALIAÇÕES DE UM ALUNO
router.get(
    "/usuario/:usuario_id",
    AvaliacaoController.listByUsuario
);


// BUSCAR AVALIAÇÃO PELO ID
router.get(
    "/:id",
    AvaliacaoController.getById
);


// ATUALIZAR AVALIAÇÃO
router.post(
    "/update",
    AvaliacaoController.update
);


// EXCLUIR AVALIAÇÃO
router.delete(
    "/delete",
    AvaliacaoController.delete
);


export default router;