import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/allowRole.js";

import { getAllUsers ,registerUser ,updateUser ,deleteUser ,changePassword } from "../Controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);

router.post("/register",registerUser);

router.patch("/:id", updateUser);

router.delete("/:id",deleteUser); 

router.post("/change-password",authMiddleware, changePassword);

export default router;