// Importa as dependências principais
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Importa as rotas da aplicação
import UserRoutes from "./routes/UserRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import TreinoRoutes from "./routes/TreinoRoutes.js";
import ExercicioRoutes from "./routes/ExercicioRoutes.js";
import AgendaTreinoRoutes from "./routes/AgendaTreinoRoutes.js";
import TreinoExercicioRoutes from "./routes/TreinoExercicioRoutes.js";
import HistoricoCargasRoutes from "./routes/HistoricoCargasRoutes.js";
import DashboardRoutes from "./routes/DashboardRoutes.js";
import AvaliacaoRoutes from "./routes/AvaliacaoRoutes.js";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Cria a aplicação Express
const app = express();

// Obtém a porta do servidor através do .env
const port_server = process.env.PORT_SERVER;

// Configura o CORS para permitir requisições entre origens diferentes
app.use(cors());

// Permite que o Express interprete dados JSON recebidos nas requisições
app.use(express.json());

// ==================== ROTAS ====================

// Rotas relacionadas aos usuários
app.use("/user", UserRoutes);

// Rotas relacionadas à autenticação/login
app.use("/", AuthRoutes);

// Rotas relacionadas aos treinos
app.use("/treino", TreinoRoutes);

// Rotas relacionadas aos exercícios
app.use("/exercicio", ExercicioRoutes);

// Rotas relacionadas à agenda de treinos
app.use("/agenda", AgendaTreinoRoutes);

// Rotas responsáveis pela relação entre treinos e exercícios
app.use("/treino-exercicio", TreinoExercicioRoutes);

// Rotas relacionadas ao histórico de cargas dos exercícios
app.use("/historico-cargas", HistoricoCargasRoutes);

// Rotas responsáveis pelos dados do dashboard
app.use("/dashboard", DashboardRoutes);

// Rotas relacionadas às avaliações e evolução dos alunos
app.use("/avaliacao", AvaliacaoRoutes);

// ==================== SERVIDOR ====================

// Inicia o servidor na porta definida no arquivo .env
app.listen(port_server, () => {
    console.log(`Servidor rodando na porta ${port_server}`);
});






