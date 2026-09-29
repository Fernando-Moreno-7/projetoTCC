// Importa o Express para criar e organizar as rotas
import routerEX from "express";

// Importa o controller responsável pela lógica de autenticação
import AuthController from "../controllers/AuthController.js";

// Cria o roteador do Express
const router = routerEX.Router();

// Rota responsável pelo login
// Direciona a requisição para a função login do AuthController
router.post("/login", AuthController.login);

// Exporta as rotas para serem utilizadas no index.js
export default router;