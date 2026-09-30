// Importa o Express para criar e organizar as rotas
import routerEX from "express";

// Importa o Controller responsável pela lógica do histórico de cargas
import HistoricoCargasController from "../controllers/HistoricoCargasController.js";

// Cria o roteador do Express
const router = routerEX.Router();

// REGISTRAR CARGA


// Registra uma nova carga no histórico
router.post(
    "/create",
    HistoricoCargasController.create
);
// HISTÓRICO DE UM EXERCÍCIO

// Busca o histórico de cargas de um exercício
router.get(
    "/exercicio/:id",
    HistoricoCargasController.getHistoricoPorExercicio
);
// HISTÓRICO DE CARGAS DE UM ALUNO
// Busca o histórico de cargas de um usuário/aluno
router.get(
    "/usuario/:usuario_id",
    HistoricoCargasController.getHistoricoPorUsuario
);
// Exporta as rotas para serem utilizadas no index.js
export default router;