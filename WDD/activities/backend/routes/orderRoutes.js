import express from "express";
import { createOrder, getOrders, getOrderById, getAllOrders, deleteAllOrders } from "../controllers/orderController.js";

const router = express.Router();

// POST /api/orders - Create a new order
router.post("/", createOrder);

// GET /api/orders - Get all orders for the logged-in user
router.get("/", getOrders);

// GET /api/orders/all - Get ALL orders (for admin)
router.get("/all", getAllOrders);

// DELETE /api/orders/all - Delete ALL orders (for admin)
router.delete("/all", deleteAllOrders);

// GET /api/orders/:id - Get a specific order by ID
router.get("/:id", getOrderById);

export default router;
