// Models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "booking",
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    default: "sslcommerz"
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "cancelled"],
    default: "pending"
  },
  paymentDetails: {
    type: Object
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);