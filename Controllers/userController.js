import { ApiResponse } from '../utils/respatterns.js';
import userModel from '../models/user.js';


export async function getAllUsers(req, res, next) {
    try {

        let page = req.query.page > 0 ? parseInt(req.query.page) : 1;
        let limit = req.query.limit > 0 ? parseInt(req.query.limit) : 30;
        let skip = page === 1 ? 0 : (page - 1) * limit;

        const users = await userModel.find({ isDeleted: false })
            .skip(skip)
            .limit(limit);

        res.status(200).json(new ApiResponse(
            true, users, "Users fetched successfully"
        ));


    } catch (error) {
        res.status(500).json(new ApiResponse(
            false, null, "Internal server error"
        ));
    }
}

export async function registerUser(req, res, next) {
    try {
        const { name, phone, email, password } = req.body;

        const user = await userModel.create({ name, phone, email, password });

        res.status(201).json(new ApiResponse(
            true, user, "User registered successfully"
        )); 
    } catch (error) {
        res.status(500).json(new ApiResponse(
            false, null, "Internal server error"
        ));
    } 
} 

export async function updateUser(req, res, next) {
    try {
        const { id } = req.params;
        const { name, phone, email ,address, gender} = req.body;

        if (!(name && phone && email && address && gender)){
            return res.status(400).json(new ApiResponse(
                false, null, "All field is required to update"
            ));
        }

        let user = await userModel.findByIdAndUpdate(id ,{ name, phone, email ,address, gender}, { returnDocument: "after" });

        if (!user) {
            return res.status(404).json(new ApiResponse(
                false, null, "User not found"
            ));
        }
        res.status(200).json(new ApiResponse(
            true, user, "User updated successfully"
        ));
    } catch (error) {
        res.status(500).json(new ApiResponse(
            false, null, "Internal server error"
        ));
    }
}

export async function deleteUser(req, res, next) {
    try {
        const { id } = req.params;  

        let user = await userModel.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json(new ApiResponse(
                false, null, "User not found"
            ));
        }   

        res.status(200).json(new ApiResponse(
            true, user, "User deleted successfully"
        ));

    } catch (error) {
        res.status(500).json(new ApiResponse(
            false, null, "Internal server error"
        )); 
    }
}

