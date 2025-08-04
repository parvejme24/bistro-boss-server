const express = require("express");
const router = express.Router();
const {
  getReviewsByMenu,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/ReviewController");
const {
  authenticateToken,
} = require("../middleware/auth");

// Review routes
router.get("/reviews/menu/:menuId", getReviewsByMenu);
router.post("/reviews/menu/:menuId", authenticateToken, addReview);
router.patch("/reviews/:reviewId", authenticateToken, updateReview);
router.delete("/reviews/:reviewId", authenticateToken, deleteReview);

module.exports = router; 