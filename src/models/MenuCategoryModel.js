const mongoose = require("mongoose");

const menuCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    menuCount: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("MenuCategory", menuCategorySchema);
