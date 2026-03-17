import mongoose from "mongoose";
import Order from "../models/orderModel.js";


export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};




export const createOrder = async (req, res) => {
    try {
        const { shipping, items, paymentMethod } = req.body;

        if (!shipping) {
            return res.status(400).json({
                success: false,
                message: "Customer details are required",
            });
        }

        const nameParts = shipping.fullName.trim().split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || "";

        if (
            !firstName?.trim() ||
            !lastName?.trim() ||
            !shipping.city?.trim() ||
            !shipping.address?.trim() ||
            !shipping.phone?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required customer fields",
            });
        }

        if (!items || !items.length) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        if (paymentMethod && paymentMethod !== "COD") {
            return res.status(400).json({
                success: false,
                message: "Only Cash on Delivery is available right now",
            });
        }

        const formattedItems = items.map((item) => ({
            productId: new mongoose.Types.ObjectId(item.productId),
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
        }));

        const total = formattedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            userId: req.user?._id || null,
            customer: {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                city: shipping.city.trim(),
                address: shipping.address.trim(),
                phone: shipping.phone.trim(),
                note: shipping.note?.trim() || "",
            },
            items: formattedItems,
            paymentMethod: "Cash on Delivery",
            total,
            status: "pending",
            paymentStatus: "unpaid",
        });
        
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};




export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};