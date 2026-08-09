import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import { sendNewBookingAdminEmail } from "../utils/sendEmail.js";

export const createBooking = async (req, res) => {
  try {
    const { serviceId, date, timeSlot, notes } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const alreadyConfirmed = await Booking.findOne({
      service: serviceId,
      date,
      timeSlot,
      status: "confirmed",
    });
    if (alreadyConfirmed) {
      return res.status(409).json({
        message: "This slot is already booked. Please choose a different date or time.",
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      service: serviceId,
      date,
      timeSlot,
      notes,
    });

    const populated = await booking.populate("service", "name price duration image");

    // Fire-and-forget: don't make the customer wait on email delivery, and
    // never let an email failure fail the booking itself.
    sendNewBookingAdminEmail({
      booking: populated,
      service: populated.service,
      customer: req.user,
    });

    res.status(201).json({ booking: populated });
  } catch (error) {
    res.status(400).json({ message: "Failed to create booking", error: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("service", "name price duration image")
      .sort({ date: -1 });
    res.json({ count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "cancelled";
    await booking.save();
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel booking", error: error.message });
  }
};
