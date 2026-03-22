import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import seedDatabase from "./seed.js";

const app = express();
const PORT = 3000;
dotenv.config();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use(
  cors({
    origin: "*",
    methods: ["*"],
  }),
);

// Start server and seed database
app.listen(PORT, async () => {
  await connectDB();
  await seedDatabase();
  console.log(`Server is running on PORT: ${PORT}`);
});
