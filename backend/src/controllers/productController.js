import productModel from "../models/productModel.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { saveImageLocally } from "../utils/saveToLocally.js";
import { deleteLocalFiles } from "../utils/deleteFiles.js";


// POST /api/products
export const createProduct = async (req, res) => {
  try {
    let { title, price, description, category, stock } = req.body;

    if (!title || price === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "title and price are required" });
    }

    let imageUrls = [];

    // if (req.files?.length) {
    //   const uploads = await Promise.all(
    //     req.files.map((f) =>
    //       uploadToCloudinary(f.buffer, "mustafa-mart/products")
    //     )
    //   );

    //   imageUrls = uploads.map((u) => u.secure_url);
    // }


    if (req.files?.length) {
      imageUrls = await Promise.all(
        req.files.map((f) => saveImageLocally(f.buffer, "products"))
      );
    }

    const titleNormal = title.toLowerCase();
    const categoryNormal = category.toLowerCase();


    const product = await productModel.create({
      title: titleNormal,
      price,
      description,
      category: categoryNormal,
      stock,
      images: imageUrls,
    });

    return res
      .status(201)
      .json({ success: true, message: "Product created", product });
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

    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (req.files?.length) {
      const imageUrls = await Promise.all(
        req.files.map((f) => saveImageLocally(f.buffer, "products"))
      );

      if (product.images?.length) {
        await deleteLocalFiles(product.images);
      }

      updates.images = imageUrls;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    return res.json({
      success: true,
      message: "Product updated",
      product: updatedProduct,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.images?.length) {
      await deleteLocalFiles(product.images);
    }

    await product.deleteOne();

    return res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const deleteProductImages = async (req, res) => {
  try {
    const { images } = req.body;

    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!images) {
      return res.status(400).json({
        success: false,
        message: "No images provided",
      });
    }

    const imagesToDelete = Array.isArray(images) ? images : [images];

    const validImages = imagesToDelete.filter((img) =>
      product.images.includes(img)
    );

    if (!validImages.length) {
      return res.status(400).json({
        success: false,
        message: "No valid images found for this product",
      });
    }

    await deleteLocalFiles(validImages);

    product.images = product.images.filter((img) => !validImages.includes(img));
    await product.save();

    return res.json({
      success: true,
      message: "Selected image(s) deleted successfully",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};