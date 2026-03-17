import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    customer: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      note: { type: String, default: "", trim: true },
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
      enum: ["Cash on Delivery"],
    },

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    },

    paymentStatus: {
      type: String,
      default: "unpaid",
      enum: ["unpaid", "paid", "failed"],
    },

    paymentInfo: {
      cardBrand: { type: String, default: "" },
      cardLast4: { type: String, default: "" },
      paymentIntentId: { type: String, default: "" },
      receiptUrl: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;