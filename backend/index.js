// Importa as dependências principais
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Middleware que verifica o token JWT
import authMiddleware from "./middlewares/authMiddleware.js";

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

// Carrega as variáveis de ambiente
dotenv.config();

// Cria a aplicação Express
const app = express();

// Obtém a porta do servidor
const port_server = process.env.PORT_SERVER;

// Permite a comunicação com o frontend
app.use(cors());

// Permite receber dados JSON
app.use(express.json());

// ==================== LOGIN ====================

// O login é público, pois é ele que gera o token.
app.use("/", AuthRoutes);

// ==================== USUÁRIOS ====================

app.use(
    "/user",

    (req, res, next) => {

        // Permite criar uma conta sem estar conectado.
        // As regras do cadastro serão conferidas na próxima etapa.
        if (
            req.method === "POST" &&
            req.path === "/register"
        ) {
            return next();
        }

        // As demais rotas de usuários exigem token válido.
        return authMiddleware(req, res, next);

    },

    UserRoutes
);

// ==================== ROTAS PROTEGIDAS ====================

// Todas estas rotas exigem um token válido.

app.use(
    "/treino",
    authMiddleware,
    TreinoRoutes
);

app.use(
    "/exercicio",
    authMiddleware,
    ExercicioRoutes
);

app.use(
    "/agenda",
    authMiddleware,
    AgendaTreinoRoutes
);

app.use(
    "/treino-exercicio",
    authMiddleware,
    TreinoExercicioRoutes
);

app.use(
    "/historico-cargas",
    authMiddleware,
    HistoricoCargasRoutes
);

app.use(
    "/dashboard",
    authMiddleware,
    DashboardRoutes
);

app.use(
    "/avaliacao",
    authMiddleware,
    AvaliacaoRoutes
);

// ==================== SERVIDOR ====================

app.listen(port_server, () => {
    console.log(`Servidor rodando na porta ${port_server}`);
});