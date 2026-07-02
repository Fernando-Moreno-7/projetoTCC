import routerEX from "express";
import AgendaTreinoController from "../controllers/AgendaTreinoController.js";

const router = routerEX.Router();

router.post("/create", AgendaTreinoController.agendar);
router.get("/list", AgendaTreinoController.list);

// Nova rota
router.get("/usuario/:usuario_id", AgendaTreinoController.getTreinoDoUsuario);

router.get("/:id", AgendaTreinoController.getById);
router.post("/update", AgendaTreinoController.update);
router.delete("/delete", AgendaTreinoController.delete);
router.post("/finalizar",AgendaTreinoController.finalizarTreino)
router.get("/usuario/:usuario_id", AgendaTreinoController.getTreinoDoUsuario);
    

export default router;