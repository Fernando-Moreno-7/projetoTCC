import "dotenv/config";
import express from "express";
import cors from "cors";

import authMiddleware from "./middlewares/authMiddleware.js";

import UserRoutes from "./routes/UserRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import TreinoRoutes from "./routes/TreinoRoutes.js";
import ExercicioRoutes from "./routes/ExercicioRoutes.js";
import AgendaTreinoRoutes from "./routes/AgendaTreinoRoutes.js";
import TreinoExercicioRoutes from "./routes/TreinoExercicioRoutes.js";
import HistoricoCargasRoutes from "./routes/HistoricoCargasRoutes.js";
import DashboardRoutes from "./routes/DashboardRoutes.js";
import AvaliacaoRoutes from "./routes/AvaliacaoRoutes.js";

const app = express();

const port_server = process.env.PORT_SERVER || 5000;

// Interrompe a inicialização se a chave JWT estiver ausente.
if (!process.env.JWT_SECRET?.trim()) {
    throw new Error(
        "Configure JWT_SECRET no arquivo .env do backend."
    );
}

app.use(cors());
app.use(express.json());

// Login público.
app.use("/", AuthRoutes);

// Cadastro público; demais operações exigem autenticação.
// O cadastro deve continuar criando somente contas de aluno.
app.use(
    "/user",
    (req, res, next) => {
        if (
            req.method === "POST" &&
            req.path === "/register"
        ) {
            return next();
        }

        return authMiddleware(req, res, next);
    },
    UserRoutes
);

// A agenda recebe autenticação aqui, pois o arquivo
// AgendaTreinoRoutes.js enviado anteriormente não possui router.use.
app.use(
    "/agenda",
    authMiddleware,
    AgendaTreinoRoutes
);

// Estes arquivos já possuem router.use(authMiddleware).
app.use("/treino", TreinoRoutes);
app.use("/exercicio", ExercicioRoutes);
app.use("/treino-exercicio", TreinoExercicioRoutes);
app.use("/historico-cargas", HistoricoCargasRoutes);
app.use("/dashboard", DashboardRoutes);
app.use("/avaliacao", AvaliacaoRoutes);

app.listen(port_server, () => {
    console.log(`Servidor rodando na porta ${port_server}`);
});