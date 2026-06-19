import routerEX from "express";
import ExercicioController from "../controllers/ExercicioController.js";

const router = routerEX.Router();

router.post("/create", ExercicioController.createExercicio);
router.get("/list", ExercicioController.getAllExercicios);

router.get("/:id", ExercicioController.getExercicioById);
router.post("/update", ExercicioController.updateExercicio);
router.delete("/delete", ExercicioController.deleteExercicio);

export default router;