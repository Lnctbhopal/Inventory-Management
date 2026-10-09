import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import allowedRoles from "../middleware/allowRole.js";
import { registerSupplier , getAllSuppliers , updateSupplier , deleteSupplier } from "../Controllers/supplierController.js";

const router = express.Router();

router.post("/register",registerSupplier);

router.get("/getAll", authMiddleware, allowedRoles("admin"), getAllSuppliers);

router.patch("/" , updateSupplier)

router.delete("/:id" , deleteSupplier);

export default router;