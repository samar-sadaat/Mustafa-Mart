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
      enum: ["in Stock", "stock out"],
      default: "in Stock",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
