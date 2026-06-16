import routerEX from "express";
import TreinoController from "../controllers/TreinoController.js";

const router = routerEX.Router();

router.post("/create", TreinoController.createTreino);
router.get("/list", TreinoController.getAllTreinos);

router.get("/:id", TreinoController.getTreinoById);

router.post("/update", TreinoController.updateTreino);

router.delete("/delete", TreinoController.deleteTreino);

export default router;