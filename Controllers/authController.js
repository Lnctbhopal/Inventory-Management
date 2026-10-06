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

        const user = await userModel.findOne({ email, isDeleted: false }).select("+password");
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

        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.isDeleted;
        delete userResponse.__v;

        userResponse.token = token;

        res.status(200).json(new ApiResponse(
            true, userResponse, "Login successful"
        ));
        
    } catch (error) {
        next(error);
    }
}