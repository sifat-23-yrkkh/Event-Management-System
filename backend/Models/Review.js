// Models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userPhoto: {
      type: String,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "eventsalls",
      required: true,
    },
    packageName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      required: true,
      maxlength: 500,
    },
    // Removed the status field
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("review", reviewSchema);