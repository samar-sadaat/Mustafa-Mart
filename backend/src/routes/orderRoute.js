import express from "express";
import { createOrder, allOrders, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/all-orders", allOrders)
router.put("/update-status/:orderId", updateOrderStatus);

export default router;