import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String },
    customer: {
      firstName: String,
      lastName: String,
      city: String,
      address: String,
      phone: String,
      note: String,
    },
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      }
    ],
    paymentMethod: { type: String, default: "Cash on Delivery" },
    total: { type: Number, required: true },
    status: { type: String, default: "pending", enum: ["pending", "processing", "shipped", "delivered", "cancelled"] },
    paymentStatus: { type: String, default: "unpaid", enum: ["unpaid", "paid", "failed"] },
    paymentInfo: {
      cardBrand: { type: String },
      cardLast4: { type: String },
      paymentIntentId: { type: String },
      receiptUrl: { type: String },
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
