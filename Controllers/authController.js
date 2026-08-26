import { ApiResponse } from "../utils/respatterns.js";
import userModel from "../models/user.js";
import {generateToken } from "../config/jwt.js";
import { verifyPassword } from "../config/bcrypt.js";

export default async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json(new ApiResponse(
                false, null, "Email and password are required"
            ));
        }

        const user = await userModel.findOne({ email, isDeleted: false });
        if (!user) {
            return res.status(401).json(new ApiResponse(
                false, null, "user not found"
            ));
        }

        let isMatch = await verifyPassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json(new ApiResponse(
                false, null, "Invalid password"
            ));
        }

        const token = await generateToken({
            id: user._id,
            role: user.role,
            name: user.name,
            email: user.email
        });

        user = user.toObject();
        delete user.password;
        delete user.isDeleted;
        delete user.__v;

        user.token = token;

        res.status(200).json(new ApiResponse(
            true, user, "Login successful"
        ));
        
    } catch (error) {
        return res.status(500).json(new ApiResponse(
            false, null, "Internal server error"
        ));
    }
}