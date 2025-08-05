const mongoose = require("mongoose");

const chefProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    displayName: { type: String, default: "" },
    chefImage: { type: String, default: "" },
    chefDescription: { type: String, default: "" },
    chefRating: { type: Number, default: 0 },
    chefReviews: { type: Number, default: 0 },
    chefOrders: { type: Number, default: 0 },
    chefEarnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChefProfile", chefProfileSchema);
