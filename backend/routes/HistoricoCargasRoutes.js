import express from "express";

import HistoricoCargasController from "../controllers/HistoricoCargasController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Exige um token válido em todas as rotas deste arquivo.
router.use(authMiddleware);

// Permite consultar o próprio histórico.
// O personal pode consultar o histórico dos alunos.
function permitirHistoricoDoUsuario(req, res, next) {
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
        message: "Você não pode consultar o histórico de outro usuário!"
    });
}

// Registrar carga.
// A propriedade do registro também deverá ser validada no controller.
router.post(
    "/create",
    HistoricoCargasController.create
);

// Consultar histórico de um exercício.
// O controller deverá filtrar os registros pelo usuário autorizado.
router.get(
    "/exercicio/:id",
    HistoricoCargasController.getHistoricoPorExercicio
);

// Consultar histórico de um usuário.
router.get(
    "/usuario/:usuario_id",
    permitirHistoricoDoUsuario,
    HistoricoCargasController.getHistoricoPorUsuario
);

export default router;