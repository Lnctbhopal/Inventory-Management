import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/allowRole.js";

import {
    getAllProducts,
    createProduct ,
    updateProduct ,
    deleteProduct
} from "../Controllers/productController.js";

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    allowRoles("admin"),
    getAllProducts
);

router.post(
    "/",
    authMiddleware,
    allowRoles("admin"),
    createProduct
);

router.put(
    "/",
    authMiddleware,
    allowRoles("admin"),
    updateProduct
);

router.delete(
    "/",
    authMiddleware,
    allowRoles("admin"),
    deleteProduct
);

export default router;