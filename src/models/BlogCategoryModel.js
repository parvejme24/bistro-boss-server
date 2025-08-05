const mongoose = require("mongoose");

const blogCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    blogCount: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("BlogCategory", blogCategorySchema);
