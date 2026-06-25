import routerEX from "express";
import HistoricoCargasController
from "../controllers/HistoricoCargasController.js";

const router = routerEX.Router();

router.post(
    "/create",
    HistoricoCargasController.create
);

export default router;