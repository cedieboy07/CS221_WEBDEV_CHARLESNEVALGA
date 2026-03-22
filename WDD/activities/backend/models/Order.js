import mongoose from "mongoose";

// Define what an Order looks like in the database
const orderSchema = new mongoose.Schema(
  {
    // Link to the user who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user", // References the User model
    },
    
    // Array of items in the order
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    
    // Shipping address
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    
    // Payment status
    isPaid: {
      type: Boolean,
      default: false,
    },
    
    // Total price in USD (for database)
    totalPrice: {
      type: Number,
      required: true,
    },
    
    // Payment method
    paymentMethod: {
      type: String,
      default: "COD", // Cash on Delivery
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// Export the model so we can use it in routes
export default mongoose.model("Order", orderSchema);
