import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    console.log("Registration request received:", req.body);
    
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("Creating new user...");
    const user = await User.create({ username, email, password });
    console.log("User created successfully:", user);
    
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    // Check if password matches
    const passwordMatched = await bcrypt.compare(password, user.password);
    
    if (passwordMatched) {
      // Create JWT token
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          name: user.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );
      
      // Return user data and token
      res.status(200).json({ 
        _id: user._id, 
        username: user.username, 
        email: user.email,
        role: user.role,
        token 
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
};
