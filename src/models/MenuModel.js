const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    ingredients: { type: [String], default: [] },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Menu", menuSchema);
