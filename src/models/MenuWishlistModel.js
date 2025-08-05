const mongoose = require("mongoose");

const menuWishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Ensure a user can only add a menu once to their wishlist
menuWishlistSchema.index({ user: 1, menu: 1 }, { unique: true });

module.exports = mongoose.model("MenuWishlist", menuWishlistSchema);
