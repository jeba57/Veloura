import crypto from "crypto";
import Razorpay from "razorpay";
import Booking from "../models/Booking.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Creates a Razorpay order for a booking — only allowed once an admin has
// approved the booking (status === "confirmed") and it hasn't been paid yet.
export const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id }).populate(
      "service",
      "name price"
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        message: "Payment is only available after your booking has been confirmed by the salon.",
      });
    }
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ message: "This booking has already been paid for" });
    }

    const amountInPaise = Math.round(booking.service.price * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `booking_${booking._id}`,
      notes: { bookingId: String(booking._id), service: booking.service.name },
    });

    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      bookingId: booking._id,
      serviceName: booking.service.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create payment order", error: error.message });
  }
};

// Verifies the Razorpay payment signature and marks the booking as paid.
export const verifyPayment = async (req, res) => {
  try {
    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ message: "Order mismatch for this booking" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    booking.paymentStatus = "paid";
    booking.paymentMethod = "Razorpay";
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.paidAt = new Date();
    await booking.save();

    res.json({ message: "Payment verified successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Payment verification error", error: error.message });
  }
};
