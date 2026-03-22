import express from "express";
import { 
  getCart, 
  updateCart, 
  addToCart, 
  removeFromCart, 
  clearCart 
} from "../controllers/cartController.js";

const router = express.Router();

// GET /api/cart - Get user's cart
router.get("/", getCart);

// PUT /api/cart - Update entire cart
router.put("/", updateCart);

// POST /api/cart/add - Add item to cart
router.post("/add", addToCart);

// DELETE /api/cart/:productId - Remove item from cart
router.delete("/:productId", removeFromCart);

// DELETE /api/cart/clear - Clear entire cart
router.delete("/", clearCart);

export default router;
