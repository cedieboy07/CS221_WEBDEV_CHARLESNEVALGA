import Order from "../models/Order.js";
import jwt from "jsonwebtoken";

// Helper function to verify JWT token
// Returns the user ID if valid, or null if not valid
const verifyToken = (req) => {
  try {
    // Get the token from the header
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return null;
    }
    
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id; // Return the user ID
  } catch (error) {
    return null;
  }
};

// Create a new order
export const createOrder = async (req, res) => {
  try {
    // Step 1: Verify the user is logged in
    const userId = verifyToken(req);
    
    if (!userId) {
      return res.status(401).json({ message: "Please log in to place an order" });
    }
    
    // Step 2: Get the order data from the request body
    const { orderItems, shippingAddress, totalPrice } = req.body;
    
    // Step 3: Validate that we have items and address
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }
    
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }
    
    // Step 4: Create the order in the database
    const order = await Order.create({
      user: userId,
      orderItems,
      shippingAddress,
      totalPrice,
    });
    
    // Step 5: Return success
    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (for admin - optional)
export const getOrders = async (req, res) => {
  try {
    // Verify user is logged in
    const userId = verifyToken(req);
    
    if (!userId) {
      return res.status(401).json({ message: "Please log in" });
    }
    
    // Get orders for this user only
    const orders = await Order.find({ user: userId })
      .populate("user", "username email")
      .sort({ createdAt: -1 }); // Newest first
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ALL orders (for admin)
export const getAllOrders = async (req, res) => {
  try {
    // Verify user is logged in
    const userId = verifyToken(req);
    
    if (!userId) {
      return res.status(401).json({ message: "Please log in" });
    }
    
    // Get ALL orders from all users
    const orders = await Order.find({})
      .populate("user", "username email")
      .sort({ createdAt: -1 }); // Newest first
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete ALL orders (for admin)
export const deleteAllOrders = async (req, res) => {
  try {
    // Verify user is logged in
    const userId = verifyToken(req);
    
    if (!userId) {
      return res.status(401).json({ message: "Please log in" });
    }
    
    // Delete ALL orders
    await Order.deleteMany({});
    
    res.status(200).json({ message: "All orders deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    // Verify user is logged in
    const userId = verifyToken(req);
    
    if (!userId) {
      return res.status(401).json({ message: "Please log in" });
    }
    
    const order = await Order.findById(req.params.id);
    
    // Check if order exists
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Check if this order belongs to the logged-in user
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
