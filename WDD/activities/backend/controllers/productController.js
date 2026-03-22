import Product from "../models/Product.js";
import mongoose from "mongoose";

export const create = async (req, res) => {
  try {
    // We extract all fields from the request body
    const { name, description, price, image, countInStock } = req.body;
    
    // We create a new product in the database
    const product = await Product.create({
      name,
      description,
      price,
      image,
      countInStock,
    });
    
    // Success! Return 201 (Created) with the new product
    res.status(201).json(product);
  } catch (error) {
    // If something goes wrong, catch it and send error
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, countInStock } = req.body;
    const productExists = await Product.findById(id);
    if (!productExists)
      return res.status(400).json({ message: "Product Does Not Exists!" });
    const productFields = {
      name,
      description,
      price,
      image,
      countInStock,
      updatedAt: new Date(),
    };
    await Product.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: productFields },
    );
    res.status(200).json({ message: "Product updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }
    
    await Product.deleteOne({ _id: id });
    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAll = async (req, res) => {
  // "req" = the request from the browser (asking for products)
  // "res" = the response we send back to the browser
  try {
    // We use Product.find({}) to get ALL products from the database
    // The empty {} means "give me everything"
    const products = await Product.find({});
    
    // We send the products back with a success code (200 = OK)
    res.status(200).json(products);
  } catch (error) {
    // If something goes wrong, we catch it and send an error
    res.status(500).json({ message: error.message });
  }
};
