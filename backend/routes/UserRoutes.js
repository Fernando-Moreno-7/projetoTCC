import routerEX from "express";
import UserController from "../controllers/UserController.js";


const router = routerEX.Router();

router.post("/register", UserController.register);
router.post("/update", UserController.updateUser);

export default router;

