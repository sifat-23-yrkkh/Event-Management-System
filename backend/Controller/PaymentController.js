// Controller/PaymentController.js
const Booking = require("../Models/Booking");
const Payment = require("../Models/Payment"); // Add this import
const { ObjectId } = require("mongodb");
const axios = require("axios");
require("dotenv").config();

const paymentController = {
  initiatePayment: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      if (booking.status !== "payment_pending") {
        return res.status(400).json({
          error: `Payment cannot be initiated for booking with status ${booking.status}`,
        });
      }

      const transactionId = booking.transactionId;
      const amount = booking.finalPrice;
      const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

      const paymentData = new URLSearchParams({
        store_id: process.env.SSLCOMMERZ_STORE_ID,
        store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
        total_amount: amount.toString(),
        currency: "BDT",
        tran_id: transactionId,
        // In initiatePayment method, update the success/fail/cancel URLs:
        success_url: `${process.env.BACKEND_URL}/bookings/${bookingId}/payment/success`,
        fail_url: `${process.env.BACKEND_URL}/api/bookings/${bookingId}/payment/fail`,
        cancel_url: `${process.env.BACKEND_URL}/api/bookings/${bookingId}/payment/cancel`,
        ipn_url: `${frontendUrl}/api/payment/ipn`,
        cus_name: booking.userName,
        cus_email: booking.userEmail,
        cus_phone: booking.userPhone || "01700000000",
        cus_add1: booking.userAddress || "Not provided",
        cus_city: booking.userCity || "Dhaka",
        cus_country: "Bangladesh",
        shipping_method: "NO",
        product_name: booking.packageName,
        product_category: "Event Package",
        product_profile: "general",
        value_a: bookingId,
        value_b: booking.userEmail,
        value_c: booking.packageName,
        value_d: amount,
      });

      const response = await axios.post(
        process.env.SSLCOMMERZ_API_URL ||
          "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
        paymentData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.status !== "SUCCESS") {
        throw new Error(
          response.data.failedreason || "Payment initiation failed"
        );
      }

      // Update booking with payment initiation details
      await Booking.findByIdAndUpdate(bookingId, {
        paymentInitiated: true,
        paymentInitiatedAt: new Date(),
      });

      res.json({
        success: true,
        paymentUrl: response.data.GatewayPageURL,
        transactionId,
      });
    } catch (error) {
      console.error("Payment initiation error:", error);
      res.status(500).json({ error: error.message });
    }
  },

  handleSuccess: async (req, res) => {
    try {
      const { bookingId } = req.params;
      console.log("------ handleSuccess endpoint HIT ------");
      console.log("Request details:", {
        method: req.method,
        params: req.params,
        query: req.query,
        body: req.body,
      });

      // Get transaction ID from wherever it might be
      let tran_id = req.query.tran_id || req.body.tran_id;
      // let val_id = req.query.val_id || req.body.val_id;

      // If still missing, try to get from booking record
      if (!tran_id) {
        const booking = await Booking.findById(bookingId);
        if (booking) {
          tran_id = booking.transactionId;
          console.log("Got transaction ID from booking:", tran_id);
        }
      }

      if (!tran_id) {
        console.error("Missing transaction ID");
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        return res.redirect(
          `${frontendUrl}/dashboard/payment/result?status=failed&error=missing_transaction_id&bookingId=${bookingId}`
        );
      }

      // Verify payment with SSLCommerz
      const verifyUrl = `https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php?tran_id=${tran_id}&store_id=${process.env.SSLCOMMERZ_STORE_ID}&store_passwd=${process.env.SSLCOMMERZ_STORE_PASSWORD}&format=json`;
      console.log("Verifying payment with URL:", verifyUrl);

      const verifyResponse = await axios.get(verifyUrl);
      console.log("Verification response:", verifyResponse.data);

      // Find the valid transaction from the response array
      const validPayment = verifyResponse.data?.element?.find(
        (txn) => txn.status === "VALID" && txn.tran_id === tran_id
      );

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

      if (!validPayment) {
        console.log("No valid payment found for transaction:", tran_id);
        await Booking.findByIdAndUpdate(
          bookingId,
          {
            paymentStatus: "failed",
            status: "cancelled",
            paymentVerified: false,
          },
          { new: true }
        );

        return res.redirect(
          `${frontendUrl}/dashboard/payment/result?status=failed&bookingId=${bookingId}`
        );
      }
      const {
        val_id,
        tran_date,
        card_type,
        card_issuer,
        card_brand,
        card_issuer_country,
      } = validPayment;

      const paymentDetails = {
        val_id: validPayment.val_id,
        tran_date: validPayment.tran_date,
        tran_id: validPayment.tran_id,
        card_type: validPayment.card_type,
        card_issuer: validPayment.card_issuer,
        card_brand: validPayment.card_brand,
        card_issuer_country: validPayment.card_issuer_country,
      };

      // Create payment record
      const payment = new Payment({
        bookingId,
        userEmail:
          validPayment.value_b || (await Booking.findById(bookingId)).userEmail,
        transactionId: tran_id,
        amount: validPayment.amount,
        status: "completed",
        paymentDetails: paymentDetails,
      });
      await payment.save();
      console.log("Payment record created:", payment);

      // Update booking status
      const updatedBooking = await Booking.findOneAndUpdate(
        { _id: bookingId },
        {
          $set: {
            paymentStatus: "paid",
            status: "confirmed",
            paymentVerified: true,
            paymentVerifiedAt: new Date(),
            paymentMethod: validPayment.card_issuer || "sslcommerz",
            paymentDetails: validPayment,
          },
        },
        { new: true }
      );

      console.log("Booking successfully updated:", updatedBooking);

      // Redirect to frontend with success status
      // In your handleSuccess function, change the redirect to:
      // In PaymentController.js handleSuccess
      res.redirect(
        `${frontendUrl}/payment-redirect.html?status=success&bookingId=${bookingId}&tran_id=${tran_id}`
      );
    } catch (error) {
      console.error("Payment success handling error:", error);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(
        `${frontendUrl}/dashboard/payment/result?status=failed&error=${encodeURIComponent(
          error.message
        )}&bookingId=${req.params.bookingId}`
      );
    }
  },
  handleFailure: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const tran_id = req.body.tran_id || req.query.tran_id;
      const error = req.body.error || req.query.error;
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

      console.log(
        "Payment failure - Booking ID:",
        bookingId,
        "Transaction ID:",
        tran_id
      );

      if (tran_id) {
        await Booking.findByIdAndUpdate(bookingId, {
          paymentStatus: "failed",
          status: "cancelled",
          paymentVerified: false,
        });

        // Also update payment record if exists
        await Payment.findOneAndUpdate(
          { transactionId: tran_id },
          { status: "failed" },
          { upsert: true }
        );
      }

      const errorMessage = error || "Payment failed due to unknown reason";
      res.redirect(
        `${frontendUrl}/payment/result?status=failed&bookingId=${bookingId}&error=${encodeURIComponent(
          errorMessage
        )}`
      );
    } catch (error) {
      console.error("Payment failure handling error:", error);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(
        `${frontendUrl}/payment/result?status=failed&error=${encodeURIComponent(
          error.message
        )}`
      );
    }
  },

  handleCancel: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const tran_id = req.body.tran_id || req.query.tran_id;
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

      console.log(
        "Payment cancelled - Booking ID:",
        bookingId,
        "Transaction ID:",
        tran_id
      );

      if (tran_id) {
        await Booking.findByIdAndUpdate(bookingId, {
          paymentStatus: "cancelled",
          status: "cancelled",
          paymentVerified: false,
        });

        // Also update payment record if exists
        await Payment.findOneAndUpdate(
          { transactionId: tran_id },
          { status: "cancelled" },
          { upsert: true }
        );
      }

      res.redirect(
        `${frontendUrl}/payment/result?status=cancelled&bookingId=${bookingId}`
      );
    } catch (error) {
      console.error("Payment cancellation handling error:", error);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(
        `${frontendUrl}/payment/result?status=cancelled&bookingId=${bookingId}`
      );
    }
  },

  handleIPN: async (req, res) => {
    try {
      console.log("IPN received:", req.body);

      const { tran_id, val_id, status, amount } = req.body;

      if (status !== "VALID") {
        console.log("Invalid IPN status:", status);
        return res.status(400).json({ error: "Invalid transaction status" });
      }

      // Verify the IPN with SSLCommerz
      const verifyUrl = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${process.env.SSLCOMMERZ_STORE_ID}&store_passwd=${process.env.SSLCOMMERZ_STORE_PASSWORD}&format=json`;

      const verifyResponse = await axios.get(verifyUrl);

      if (verifyResponse.data.status !== "VALID") {
        console.log("IPN verification failed:", verifyResponse.data);
        return res.status(400).json({ error: "Payment verification failed" });
      }

      // Find booking by transaction ID
      const booking = await Booking.findOne({ transactionId: tran_id });
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // Update payment record
      await Payment.findOneAndUpdate(
        { transactionId: tran_id },
        {
          status: "completed",
          paymentDetails: verifyResponse.data,
        },
        { upsert: true }
      );

      // Update booking with payment details
      await Booking.findByIdAndUpdate(booking._id, {
        paymentStatus: "paid",
        status: "confirmed",
        paymentVerified: true,
        paymentVerifiedAt: new Date(),
        paymentMethod: "sslcommerz",
        paymentDetails: verifyResponse.data,
      });

      console.log("IPN processed successfully for transaction:", tran_id);
      res.json({ success: true, message: "IPN processed successfully" });
    } catch (error) {
      console.error("IPN handling error:", error);
      res.status(500).json({ error: error.message });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          paymentStatus: "paid",
          status: "confirmed",
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
  },
  // Add to PaymentController.js
  verifyPaymentStatus: async (req, res) => {
    try {
      const { id } = req.params;

      // Find both booking and payment records
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      const payment = await Payment.findOne({ bookingId: id });

      // Prepare response data
      const responseData = {
        bookingId: id,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        transactionId: booking.transactionId,
        amount: booking.finalPrice,
        packageName: booking.packageName,
        paymentDetails: payment?.paymentDetails || null,
        verified: booking.paymentVerified || false,
        verifiedAt: booking.paymentVerifiedAt || null,
      };

      res.status(200).json(responseData);
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getPaymentsByEmail: async (req, res) => {
    try {
      const { email } = req.params;

      // Find all payments for the user's email
      const payments = await Payment.find({ userEmail: email }).sort({
        createdAt: -1,
      }); // Newest first

      if (!payments || payments.length === 0) {
        return res.status(404).json({
          message: "No payments found for this email",
        });
      }

      res.status(200).json({
        success: true,
        count: payments.length,
        data: payments,
      });
    } catch (error) {
      console.error("Error fetching payments by email:", error);
      res.status(500).json({
        success: false,
        error: "Server error while fetching payments",
      });
    }
  },
   getPayments : async (req, res) => {
    try {
      const payments = await Payment.find({});
      res.status(200).json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = paymentController;
