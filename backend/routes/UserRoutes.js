import routerEX from "express";
import UserController from "../controllers/UserController.js";


const router = routerEX.Router();

router.post("/register", UserController.register);

export default router;

