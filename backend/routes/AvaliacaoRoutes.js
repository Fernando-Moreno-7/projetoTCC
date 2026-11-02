import express from "express";

import AvaliacaoController from "../controllers/AvaliacaoController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

import {
    permitirPerfis
} from "../middlewares/autorizacaoMiddleware.js";

const router = express.Router();

// Exige autenticação em todas as rotas.
router.use(authMiddleware);

// Permite ao aluno consultar somente suas próprias avaliações.
// O personal pode consultar as avaliações dos alunos.
function permitirAvaliacoesDoUsuario(req, res, next) {
    const usuarioId = Number(req.params.usuario_id);

    if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
        return res.status(422).json({
            message: "Informe um ID de usuário válido!"
        });
    }

    if (req.usuario.tipo_usuario === "personal") {
        return next();
    }

    if (
        req.usuario.tipo_usuario === "aluno" &&
        usuarioId === Number(req.usuario.id)
    ) {
        return next();
    }

    return res.status(403).json({
        message: "Você não pode consultar as avaliações de outro usuário!"
    });
}

// Criar avaliação: somente personal.
router.post(
    "/create",
    permitirPerfis("personal"),
    AvaliacaoController.create
);

// Listar todas as avaliações: somente personal.
router.get(
    "/list",
    permitirPerfis("personal"),
    AvaliacaoController.list
);

// Consultar avaliações do usuário autorizado.
router.get(
    "/usuario/:usuario_id",
    permitirAvaliacoesDoUsuario,
    AvaliacaoController.listByUsuario
);

// A propriedade da avaliação precisa ser verificada no controller.
router.get(
    "/:id",
    AvaliacaoController.getById
);

// Atualizar avaliação: somente personal.
router.post(
    "/update",
    permitirPerfis("personal"),
    AvaliacaoController.update
);

// Excluir avaliação: somente personal.
router.delete(
    "/delete",
    permitirPerfis("personal"),
    AvaliacaoController.delete
);

export default router;