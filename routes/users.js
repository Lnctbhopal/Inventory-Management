import express from "express";

// import allowRoles from "../middleware/allowRole.js";

import { getAllUsers ,registerUser ,updateUser ,deleteUser } from "../Controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);

router.post("/register",registerUser);

router.patch("/:id", updateUser);

router.delete("/:id",deleteUser); 

export default router;