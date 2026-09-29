// Importa o Express para criar e organizar as rotas
import routerEX from "express";

// Importa o controller responsável pela lógica dos treinos
import TreinoController from "../controllers/TreinoController.js";

// Cria o roteador do Express
const router = routerEX.Router();


// =========================================
// CRIAR TREINO
// =========================================

// Cria um novo treino
// Rota completa: POST /treino/create
router.post("/create", TreinoController.createTreino);


// =========================================
// LISTAR TREINOS
// =========================================

// Busca e lista os treinos
// Rota completa: GET /treino/list
router.get("/list", TreinoController.getAllTreinos);


// =========================================
// BUSCAR TREINO PELO ID
// =========================================

// Busca um treino específico através do ID
// :id é um parâmetro dinâmico da URL
// Exemplo: GET /treino/10
router.get("/:id", TreinoController.getTreinoById);


// =========================================
// ATUALIZAR TREINO
// =========================================

// Atualiza os dados de um treino
// Rota completa: POST /treino/update
router.post("/update", TreinoController.updateTreino);


// =========================================
// EXCLUIR TREINO
// =========================================

// Exclui um treino
// Rota completa: DELETE /treino/delete
router.delete("/delete", TreinoController.deleteTreino);


// Exporta as rotas para serem utilizadas no index.js
export default router;