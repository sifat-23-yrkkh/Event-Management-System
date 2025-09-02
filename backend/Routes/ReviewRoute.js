// Routes/ReviewRoute.js
const express = require("express");
const router = express.Router();
const {
  createReview,
  getUserReviews,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview
} = require("../Controller/ReviewController");

// Create a review for a booking
router.post("/bookings/:bookingId/reviews", createReview);

// Get reviews by user email
router.get("/user/:email", getUserReviews);

// Get all reviews
router.get("/", getReviews);

// Get single review by ID
router.get("/:reviewId", getReviewById);

// Update review content
router.put("/:reviewId", updateReview);

// Delete a review
router.delete("/:reviewId", deleteReview);

module.exports = router;