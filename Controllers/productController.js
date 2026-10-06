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