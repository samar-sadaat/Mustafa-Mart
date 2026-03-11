import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { uploadProductImages, resizeProductImages } from "../middlewares/multer.js";

const router = express.Router();

// Create (max 6 images)
router.post("/createProduct", uploadProductImages, resizeProductImages, createProduct);

// Read
router.get("/all-products", getProducts);
router.get("/:id", getProductById);

// Update (optional max 6 new images)
router.patch("/:id", uploadProductImages, resizeProductImages, updateProduct);

// Delete
router.delete("/:id", deleteProduct);

export default router;