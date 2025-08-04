const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Review", reviewSchema);
