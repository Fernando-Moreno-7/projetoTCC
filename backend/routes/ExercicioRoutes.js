// Importa o Express para criar e organizar as rotas
import routerEX from "express";

// Importa o controller responsável pela lógica dos exercícios
import ExercicioController from "../controllers/ExercicioController.js";

// Cria o roteador do Express
const router = routerEX.Router();


// CRIAR EXERCÍCIO
// Cria um novo exercício
// Rota completa: POST /exercicio/create
router.post("/create", ExercicioController.createExercicio);


// LISTAR EXERCÍCIOS
// Busca e lista todos os exercícios
// Rota completa: GET /exercicio/list
router.get("/list", ExercicioController.getAllExercicios);


// BUSCAR EXERCÍCIO PELO ID
// Busca um exercício específico através do ID
// :id é um parâmetro dinâmico da URL
// Exemplo: GET /exercicio/10
router.get("/:id", ExercicioController.getExercicioById);


// ATUALIZAR EXERCÍCIO
// Atualiza os dados de um exercício
// Rota completa: POST /exercicio/update
router.post("/update", ExercicioController.updateExercicio);


// EXCLUIR EXERCÍCIO
// Exclui um exercício
// Rota completa: DELETE /exercicio/delete
router.delete("/delete", ExercicioController.deleteExercicio);


// Exporta as rotas para serem utilizadas no index.js
export default router;