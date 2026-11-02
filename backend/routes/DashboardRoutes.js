import express from "express";

import DashboardController from "../controllers/DashboardController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Exige autenticação em todas as rotas.
router.use(authMiddleware);

// Aluno consulta somente o próprio dashboard.
// Personal pode consultar o dashboard dos alunos.
function permitirDashboardDoUsuario(req, res, next) {
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
        message: "Você não pode acessar o dashboard de outro usuário!"
    });
}

// Buscar dados do usuário autorizado.
router.get(
    "/:usuario_id",
    permitirDashboardDoUsuario,
    DashboardController.getDashboard
);

export default router;