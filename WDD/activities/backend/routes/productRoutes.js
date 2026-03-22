import express from "express";
import { create, update, getAll, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

// GET route - gets all products
router.get("/", getAll);

// POST route - creates a new product
router.post("/create", create);

// PUT route - updates a product by ID
router.put("/update/:id", update);

// DELETE route - deletes a product by ID
router.delete("/delete/:id", deleteProduct);

export default router;