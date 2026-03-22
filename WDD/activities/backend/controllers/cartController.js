import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Helper function to verify JWT token
const verifyToken = (req) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// Get user's cart from MongoDB
export const getCart = async (req, res) => {
  try {
    const userId = verifyToken(req);
    
    if (!userId) {
      return res.status(401).json({ message: "Please log in" });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user.cart || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user's cart in MongoDB
export const updateCart = async (req, res) => {
  try {
    const userId = verifyToken(req);
    
    if (!userId) {
      return res.status(401).json({ message: "Please log in" });
    }
    
    const { cart } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { cart: cart },
      { new: true } // Return the updated document
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = verifyToken(req);
    
    if (!userId) {
      return res.status(401).json({ message: "Please log in" });
    }
    
    const { product } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Initialize cart if it doesn't exist
    if (!user.cart) {
      user.cart = [];
    }
    
    // Check if product already exists in cart
    const existingItem = user.cart.find(
      (item) => item._id.toString() === product._id
    );
    
    if (existingItem) {
      // Increase quantity if already in cart
      existingItem.quantity += 1;
    } else {
      // Add new item to cart
      user.cart.push({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        countInStock: product.countInStock,
        quantity: 1,
      });
    }
    
    await user.save();
    
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = verifyToken(req);
    
    if (!userId) {
      return res.status(401).json({ message: "Please log in" });
    }
    
    const { productId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove item from cart
    user.cart = user.cart.filter(
      (item) => item._id.toString() !== productId
    );
    
    await user.save();
    
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = verifyToken(req);
    
    if (!userId) {
      return res.status(401).json({ message: "Please log in" });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { cart: [] },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
