// Importa o Express para criar e organizar as rotas
import routerEX from "express";

// Importa o Controller responsável pela lógica do Dashboard
import DashboardController from "../controllers/DashboardController.js";

// Cria o roteador do Express
const router = routerEX.Router();
// BUSCAR DADOS DO DASHBOARD
// Busca os dados do Dashboard de um usuário
// :usuario_id é um parâmetro dinâmico que representa o ID do usuário
router.get(
    "/:usuario_id",
    DashboardController.getDashboard
);
// Exporta as rotas para serem utilizadas no index.js
export default router;