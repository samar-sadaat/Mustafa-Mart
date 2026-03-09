import productModel from "../models/productModel.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { title, price, description, category, stock } = req.body;
    if (!title || price === undefined) {
      return res.status(400).json({ success: false, message: "title and price are required" });
    }

    let imageUrls = [];
    if (req.files?.length) {
      // max 6 already enforced by multer
      const uploads = await Promise.all(
        req.files.map((f) => uploadToCloudinary(f.buffer, "mustafa-mart/products"))
      );
      imageUrls = uploads.map((u) => u.secure_url);
    }

    const product = await productModel.create({
      title,
      price,
      description,
      category,
      stock,
      images: imageUrls,
    });

    return res.status(201).json({ success: true, message: "Product created", product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });
    return res.json({ success: true, products });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/products/:id
// If new images are sent, it will REPLACE images (simple behavior).
export const updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.files?.length) {
      const uploads = await Promise.all(
        req.files.map((f) => uploadToCloudinary(f.buffer, "mustafa-mart/products"))
      );
      updates.images = uploads.map((u) => u.secure_url);
    }

    const product = await productModel.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    return res.json({ success: true, message: "Product updated", product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    return res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};