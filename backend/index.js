import dotenv from "dotenv";
import express from "express";
import UserRoutes from "./routes/UserRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import TreinoRoutes from "./routes/TreinoRoutes.js";
import ExercicioRoutes from "./routes/ExercicioRoutes.js";
import AgendaTreinoRoutes from "./routes/AgendaTreinoRoutes.js";
import TreinoExercicioRoutes from "./routes/TreinoExercicioRoutes.js";
import HistoricoCargasRoutes from "./routes/HistoricoCargasRoutes.js";
import DashboardRoutes from "./routes/DashboardRoutes.js";

dotenv.config();

const app = express();

const port_server = process.env.PORT_SERVER;

app.use(express.json());

// Rotas
app.use("/user", UserRoutes);
app.use("/", AuthRoutes);
app.use("/treino", TreinoRoutes);
app.use("/exercicio", ExercicioRoutes);
app.use("/agenda", AgendaTreinoRoutes);
app.use("/treino-exercicio", TreinoExercicioRoutes);
app.use("/historico-cargas", HistoricoCargasRoutes);
app.use("/dashboard", DashboardRoutes);

// Inicia o servidor
app.listen(port_server, () => {
    console.log(`Servidor rodando na porta ${port_server}`);
});








