import { ApiResponse } from "../utils/respatterns.js";
import productModel from "../models/product.js";


export async function getAllProducts(req, res, next) {
    try {

        let page = req.query.page > 0 ? parseInt(req.query.page) : 1;
        let limit = req.query.limit > 0 ? parseInt(req.query.limit) : 10;
        let skip = page === 1 ? 0 : (page - 1) * limit;

        const products = await productModel.find({ isDeleted: false })
            .skip(skip)
            .limit(limit);

        return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));

    } catch (error) {
        next(error);
    }

}


export async function createProduct(req, res, next) {
    try {
        const {
            name,
            sku,
            description,
            category,
            brand,
            price,
            purchasePrice,
            stock,
            minimumStock,
            unit,
            supplier
        } = req.body;

        const requiredValues = [name, sku, category, price, purchasePrice, stock];
        if (requiredValues.some(
            (value) =>
                value === undefined ||
                value === null ||
                (typeof value === "string" && value.trim() === "")
        )) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, "Required fields are missing"));
        }

        const product = await productModel.create({
            name,
            sku,
            description,
            category,
            brand,
            price,
            purchasePrice,
            stock,
            minimumStock,
            unit,
            supplier
        });

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    product,
                    "Product created successfully"
                )
            );

    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res
                .status(400)
                .json(new ApiResponse(400, null, error.message));
        }

        if (error.code === 11000) {
            return res
                .status(409)
                .json(new ApiResponse(409, null, "A product with this SKU already exists"));
        }

        next(error);
    }
}

export async function updateProduct(req, res, next) {
    try {
        const {
            id,
            _id,
            name,
            sku,
            description,
            category,
            brand,
            price,
            purchasePrice,
            stock,
            minimumStock,
            unit,
            supplier,
            images,
            isActive
        } = req.body;
        const productId = id || _id;

        if (!productId) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, "Product id is required"));
        }

        const updates = {
            name,
            sku,
            description,
            category,
            brand,
            price,
            purchasePrice,
            stock,
            minimumStock,
            unit,
            supplier,
            images,
            isActive
        };
        for (const key of Object.keys(updates)) {
            if (updates[key] === undefined) {
                delete updates[key];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, "At least one product field is required"));
        }

        const product = await productModel.findByIdAndUpdate(
            productId,
            updates,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Product not found"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, product, "Product updated successfully"));
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res
                .status(400)
                .json(new ApiResponse(400, null, error.message));
        }

        if (error.code === 11000) {
            return res
                .status(409)
                .json(new ApiResponse(409, null, "A product with this SKU already exists"));
        }

        next(error);
    }
}