import routerEX from "express";
import TreinoExercicioController from "../controllers/TreinoExercicioController.js";

const router = routerEX.Router();

router.post("/add", TreinoExercicioController.add);
router.get("/list", TreinoExercicioController.list);
router.post("/update", TreinoExercicioController.update);
router.delete("/delete", TreinoExercicioController.delete);

export default router;