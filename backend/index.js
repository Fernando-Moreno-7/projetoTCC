import dotenv from "dotenv";
import express from "express";
import UserRoutes from "./routes/UserRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js";

dotenv.config();
const app = express();

const port_server = process.env.PORT_SERVER;
const port_app = process.env.PORT_APP;

app.use(express.json());

// Rotas 
app.use("/user", UserRoutes);
app.use("/", AuthRoutes);

app.listen(port_server);





