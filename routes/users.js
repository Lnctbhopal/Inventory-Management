import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/allowRole.js";
import userUpload from "../config/multer.js";


import { getAllUsers ,registerUser ,updateUser ,deleteUser ,changePassword,toggleUserStatus ,userProfile} from "../Controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);

router.post("/register",registerUser);

router.patch("/:id", updateUser);

router.delete("/:id",deleteUser); 

router.post("/change-password",authMiddleware, changePassword);

router.post("/", toggleUserStatus); 


router.patch( "/profile/:id", authMiddleware ,userUpload.single("image"), userProfile);



export default router;