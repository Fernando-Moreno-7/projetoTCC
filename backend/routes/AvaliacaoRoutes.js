// Importa o Express para criar e configurar as rotas
import express from "express";

// Importa o Controller responsável pela lógica das avaliações
import AvaliacaoController from "../controllers/AvaliacaoController.js";


// Cria o roteador do Express
const router = express.Router();

// CRIAR AVALIAÇÃO


// Chama o método create do AvaliacaoController
router.post(
    "/create",
    AvaliacaoController.create
);



// LISTAR TODAS AS AVALIAÇÕES



// Chama o método list do AvaliacaoController
router.get(
    "/list",
    AvaliacaoController.list
);

// LISTAR AVALIAÇÕES DE UM USUÁRIO


// GET /avaliacao/usuario/:usuario_id
// O usuario_id é recebido através do req.params
// Retorna as avaliações relacionadas ao usuário informado
router.get(
    "/usuario/:usuario_id",
    AvaliacaoController.listByUsuario
);

// BUSCAR AVALIAÇÃO PELO ID

// GET /avaliacao/:id
// O id é recebido através do req.params
// Busca uma avaliação específica pelo ID da avaliação
router.get(
    "/:id",
    AvaliacaoController.getById
);

// ATUALIZAR AVALIAÇÃO

// Chama o método update do AvaliacaoController
router.post(
    "/update",
    AvaliacaoController.update
);

// EXCLUIR AVALIAÇÃO
// Chama o método delete do AvaliacaoController
router.delete(
    "/delete",
    AvaliacaoController.delete
);


// Exporta as rotas para serem utilizadas no index.js
export default router;