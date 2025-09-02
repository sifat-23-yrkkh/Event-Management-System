// Controller/ReviewController.js
const Review = require("../Models/Review");
const Booking = require("../Models/Booking");

const createReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const reviewData = req.body;

    // Check if booking exists and is in event_done status
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (booking.status !== "event_done") {
      return res.status(400).json({ 
        error: "Review can only be submitted after event is done" 
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ 
        error: "Review already submitted for this booking" 
      });
    }

    // Create the review
    const newReview = new Review({
      ...reviewData,
      bookingId,
      packageId: booking.eventId,
      packageName: booking.packageName,
      userId: booking.userId,
      userEmail: booking.userEmail,
      userName: booking.userName,
      userPhoto: booking.userPhoto
    });

    const savedReview = await newReview.save();

    // Update booking status to completed
    await Booking.findByIdAndUpdate(bookingId, { status: "completed" });

    res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const { email } = req.params;
    const reviews = await Review.find({ userEmail: email })
      .sort({ createdAt: -1 })
      .populate('packageId');

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate('packageId');

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId).populate('packageId');

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updateData = req.body;

    // Prevent changing certain fields
    if (updateData.bookingId || updateData.userEmail || updateData.userId) {
      return res.status(400).json({ 
        error: "Cannot change booking or user information" 
      });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true, runValidators: true }
    ).populate('packageId');

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Optionally: Update booking status back to event_done
    await Booking.findByIdAndUpdate(review.bookingId, { 
      status: "event_done" 
    });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createReview,
  getUserReviews,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview
};