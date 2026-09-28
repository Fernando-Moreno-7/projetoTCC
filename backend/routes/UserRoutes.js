// Importa o Express para criar e organizar as rotas
import routerEX from "express";

// Importa o controller responsável pela lógica dos usuários
import UserController from "../controllers/UserController.js";

// Cria o roteador do Express
const router = routerEX.Router();

// Cadastra um novo usuário
// Rota completa: POST /user/register
router.post("/register", UserController.register);

// Atualiza os dados de um usuário
router.post("/update", UserController.updateUser);

// Exclui um usuário
router.delete("/delete", UserController.deleteUser);

// Lista todos os usuários
router.get("/list", UserController.getAllUsers);

// Busca um usuário específico através do ID

router.get("/:id", UserController.getUserById);

// Exporta as rotas para serem utilizadas no index.js
export default router;