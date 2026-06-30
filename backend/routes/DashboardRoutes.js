import routerEX from "express";
import DashboardController from "../controllers/DashboardController.js";

const router = routerEX.Router();

router.get(
    "/:usuario_id",
    DashboardController.getDashboard
);

export default router;