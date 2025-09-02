// Models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "eventsalls",
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
    packageName: {
      type: String,
      required: true,
    },
    cart_Image: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    photographyTeamSize: {
      type: Number,
      required: true,
    },
    videography: {
      type: Boolean,
      required: true,
    },
    durationHours: {
      type: Number,
      required: true,
    },
    expectedAttendance: {
      type: Number,
      required: true,
    },
    staffTeamSize: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "payment_pending",
        "confirmed",
        "cancelled",
        "event_done",
        "completed",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "cancelled"],
      default: "pending",
    },
    transactionId: {
      type: String,
    },
    couponCode: {
      type: String,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("booking", bookingSchema);
