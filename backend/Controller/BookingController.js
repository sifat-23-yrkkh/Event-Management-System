// Controller/BookingController.js
const Booking = require("../Models/Booking");
const EventPackage = require("../Models/EventPackage");
const { ObjectId } = require('mongodb');

const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    
    // Validate event exists
    const event = await EventPackage.findById(bookingData.eventId);
    if (!event) {
      return res.status(404).json({ error: "Event package not found" });
    }

    // Create transaction ID using MongoDB ObjectId
    bookingData.transactionId = new ObjectId().toString();
    bookingData.finalPrice = bookingData.totalPrice - (bookingData.discountAmount || 0);

    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const initiatePayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // In a real implementation, you would generate SSLCommerz payment parameters here
    // This is a simplified version
    const paymentData = {
      transactionId: booking.transactionId,
      amount: booking.finalPrice,
      currency: "BDT",
      successUrl: `${process.env.FRONTEND_URL}/payment/success/${booking._id}`,
      failUrl: `${process.env.FRONTEND_URL}/payment/fail/${booking._id}`,
      cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel/${booking._id}`,
      customerEmail: booking.userEmail,
      customerName: booking.userName
    };

    res.status(200).json(paymentData);
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const approveBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log(bookingId);
    
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        status: "payment_pending" 
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    console.log(booking);
    

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error approving booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const completeEvent = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        status: "event_done" 
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error completing event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update verifyPayment to set correct status
const verifyPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        paymentStatus: "paid",
        status: "confirmed" // Payment verified, booking confirmed
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { email } = req.params;
    const bookings = await Booking.find({ userEmail: email })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate('eventId'); // Populate event details if needed

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  createBooking,
  initiatePayment,
  verifyPayment,
  approveBooking,
  completeEvent,
  getUserBookings,
  getBookings
};