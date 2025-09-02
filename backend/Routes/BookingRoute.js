// Routes/BookingRoute.js
const {
  createBooking,
  getUserBookings,
  getBookings,
  approveBooking,
  completeEvent,
} = require("../Controller/BookingController");
const paymentController = require("../Controller/PaymentController");
const express = require("express");
const router = express.Router();

router.post("/", createBooking);
router.get("/user/:email", getUserBookings);
router.get("/bookings", getBookings);
router.patch("/:bookingId/complete", completeEvent)
router.patch("/:bookingId/approve", approveBooking)

// Payment routes
router.get("/:bookingId/payment/initiate", paymentController.initiatePayment);
router.get("/:bookingId/payment/success", paymentController.handleSuccess);
router.post("/:bookingId/payment/success", paymentController.handleSuccess);
router.get("/:bookingId/payment/fail", paymentController.handleFailure);
router.post("/:bookingId/payment/fail", paymentController.handleFailure);
router.get("/:bookingId/payment/cancel", paymentController.handleCancel);
router.post("/:bookingId/payment/cancel", paymentController.handleCancel);
router.post("/:bookingId/payment/verify", paymentController.verifyPayment);
router.post("/payment/ipn", paymentController.handleIPN);
router.get(
  "/bookings/payment/verify/:id",
  paymentController.verifyPaymentStatus
);
router.get("/payments/user/:email", paymentController.getPaymentsByEmail);
router.get("/payments", paymentController.getPayments);

module.exports = router;
