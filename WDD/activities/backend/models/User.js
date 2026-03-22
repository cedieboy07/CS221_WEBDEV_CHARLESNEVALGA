import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Cart field - stores the user's shopping cart
    cart: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        description: String,
        price: Number,
        image: String,
        countInStock: Number,
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true },
);

//Middleware - hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("user", userSchema);
