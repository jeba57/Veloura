import Booking from "../models/Booking.js";
import User from "../models/User.js";

/* ---------------- Bookings ---------------- */

export const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const bookings = await Booking.find(filter)
      .populate("user", "name email phone")
      .populate("service", "name price duration image")
      .sort({ createdAt: -1 });
    res.json({ count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};

// Checks whether another CONFIRMED booking already occupies the same
// service + date + timeSlot combination.
const hasSlotConflict = async (booking) => {
  const conflict = await Booking.findOne({
    _id: { $ne: booking._id },
    service: booking.service,
    date: booking.date,
    timeSlot: booking.timeSlot,
    status: "confirmed",
  });
  return Boolean(conflict);
};

export const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("service", "name");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "pending") {
      return res.status(400).json({ message: `Booking is already ${booking.status}` });
    }

    const conflict = await hasSlotConflict(booking);
    if (conflict) {
      return res.status(409).json({
        message: "This slot is already booked and confirmed for another customer. Please reject or ask the customer to pick a different slot.",
      });
    }

    booking.status = "confirmed";
    booking.reviewedBy = req.user._id;
    booking.reviewedAt = new Date();
    await booking.save();

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve booking", error: error.message });
  }
};

export const rejectBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "pending") {
      return res.status(400).json({ message: `Booking is already ${booking.status}` });
    }

    booking.status = "rejected";
    booking.reviewedBy = req.user._id;
    booking.reviewedAt = new Date();
    booking.rejectionReason = reason || "";
    await booking.save();

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject booking", error: error.message });
  }
};

/* ---------------- Customers ---------------- */

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).sort({ createdAt: -1 });
    res.json({ count: customers.length, customers: customers.map((c) => c.toSafeObject()) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch customers", error: error.message });
  }
};

/* ---------------- Admin account management (Super Admin only) ---------------- */

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ["admin", "super_admin"] } }).sort({
      createdAt: -1,
    });
    res.json({ count: admins.length, admins: admins.map((a) => a.toSafeObject()) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins", error: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const admin = await User.create({ name, email, password, phone, role: "admin" });
    res.status(201).json({ admin: admin.toSafeObject() });
  } catch (error) {
    res.status(500).json({ message: "Failed to create admin", error: error.message });
  }
};

export const removeAdmin = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: "Admin not found" });

    if (target.role === "super_admin") {
      return res.status(403).json({ message: "Super Admin accounts cannot be removed here" });
    }
    if (target._id.equals(req.user._id)) {
      return res.status(400).json({ message: "You cannot remove your own account" });
    }

    // Demote instead of hard-delete, so booking history (reviewedBy) stays intact.
    target.role = "customer";
    await target.save();

    res.json({ message: "Admin access revoked" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove admin", error: error.message });
  }
};
