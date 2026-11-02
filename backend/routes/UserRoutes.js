import routerEX from "express";

import UserController from "../controllers/UserController.js";

import {
    permitirPerfis,
    permitirProprioUsuarioOuPersonal
} from "../middlewares/autorizacaoMiddleware.js";

const router = routerEX.Router();

// Cadastro público: permite somente criar contas de aluno.
router.post(
    "/register",

    (req, res, next) => {

        req.body = req.body || {};

        // Impede solicitar o perfil personal pelo cadastro público.
        if (
            req.body.tipo_usuario !== undefined &&
            req.body.tipo_usuario !== "aluno"
        ) {
            return res.status(403).json({
                message: "O cadastro público permite somente contas de aluno!"
            });
        }

        req.body.tipo_usuario = "aluno";

        return next();
    },

    UserController.register
);

// Somente o personal pode atualizar os cadastros.
router.post(
    "/update",
    permitirPerfis("personal"),
    UserController.updateUser
);

// Somente o personal pode excluir usuários.
router.delete(
    "/delete",
    permitirPerfis("personal"),
    UserController.deleteUser
);

// Somente o personal pode listar todos os alunos.
router.get(
    "/list",
    permitirPerfis("personal"),
    UserController.getAllUsers
);

// Personal consulta cadastros; aluno consulta somente o próprio.
router.get(
    "/:id",
    permitirProprioUsuarioOuPersonal,
    UserController.getUserById
);

export default router;