import routerEX from "express";
import UserController from "../controllers/UserController.js";


const router = routerEX.Router();

router.post("/register", UserController.register);
router.post("/update", UserController.updateUser);
router.delete("/delete", UserController.deleteUser);
router.get("/list", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);

export default router;

