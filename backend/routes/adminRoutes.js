import express from "express";
import {
  getAllBookings,
  approveBooking,
  rejectBooking,
  getAllCustomers,
  getAllAdmins,
  createAdmin,
  removeAdmin,
} from "../controllers/adminController.js";
import { protect, adminOnly, superAdminOnly } from "../middleware/auth.js";
const router = express.Router();
router.use(protect, adminOnly);

router.get("/bookings", getAllBookings);
router.patch("/bookings/:id/approve", approveBooking);
router.patch("/bookings/:id/reject", rejectBooking);

router.get("/customers", getAllCustomers);

// Super Admin only — managing other admin accounts
router.get("/admins", superAdminOnly, getAllAdmins);
router.post("/admins", superAdminOnly, createAdmin);
router.delete("/admins/:id", superAdminOnly, removeAdmin);

export default router;
