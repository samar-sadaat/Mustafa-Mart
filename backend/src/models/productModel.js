import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    images: { type: [String], default: [] },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    stock: {
      type: String,
      enum: ["in stock", "stock out"],
      default: "in stock",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
