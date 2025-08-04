const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    phone: { type: String },
    country: { type: String },
    state: { type: String },
    region: { type: String },
    zipcode: { type: String },
    city: { type: String },
    detailsAddress: { type: String },
    role: {
      type: String,
      enum: ["customer", "chef", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
