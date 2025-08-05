const mongoose = require("mongoose");

const chefSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    displayImage: { type: String },
    country: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chef", chefSchema);
