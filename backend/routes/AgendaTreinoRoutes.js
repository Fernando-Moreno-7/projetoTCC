import routerEX from "express";
import AgendaTreinoController from "../controllers/AgendaTreinoController.js";

const router = routerEX.Router();

router.post("/create", AgendaTreinoController.agendar);
router.get("/list", AgendaTreinoController.list);
router.get("/:id", AgendaTreinoController.getById);
router.post("/update", AgendaTreinoController.update);
router.delete("/delete", AgendaTreinoController.delete);

export default router;