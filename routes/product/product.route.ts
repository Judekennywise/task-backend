import express from "express";
import { isAuthenticated } from "../../middleware/auth";
import {createProduct, getAllProducts, deleteProduct, updateProduct, checkOrderStatus} from "../../controller/user/product/product.controller";

const productRouter = express.Router();

productRouter.post("/create-product", isAuthenticated, createProduct);
productRouter.get("/get-all-products", isAuthenticated, getAllProducts);
productRouter.delete("/delete-product/:id", isAuthenticated, deleteProduct);
productRouter.put("/update-product/:id", isAuthenticated, updateProduct);
productRouter.post("/check-order-status", isAuthenticated, checkOrderStatus);

export default productRouter;
