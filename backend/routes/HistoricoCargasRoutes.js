import routerEX from "express";
import HistoricoCargasController from "../controllers/HistoricoCargasController.js";

const router = routerEX.Router();


// REGISTRAR CARGA
router.post(
    "/create",
    HistoricoCargasController.create
);


// HISTÓRICO DE UM EXERCÍCIO
router.get(
    "/exercicio/:id",
    HistoricoCargasController.getHistoricoPorExercicio
);


// HISTÓRICO DE CARGAS DE UM ALUNO
router.get(
    "/usuario/:usuario_id",
    HistoricoCargasController.getHistoricoPorUsuario
);


export default router;