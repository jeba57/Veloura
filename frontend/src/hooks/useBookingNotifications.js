import { useEffect, useState, useCallback } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const STORAGE_KEY_PREFIX = "salon_bookings_last_seen_";

// Tracks bookings whose status was reviewed (confirmed/rejected by an admin)
export const useBookingNotifications = () => {
  const { user } = useAuth();
  const [unseenCount, setUnseenCount] = useState(0);
  const [unseenBookings, setUnseenBookings] = useState([]);

  const storageKey = user ? `${STORAGE_KEY_PREFIX}${user.id}` : null;

  const checkForUpdates = useCallback(async () => {
    if (!user || user.role !== "customer") return;
    try {
      const res = await api.get("/bookings/my-bookings");
      const bookings = res.data.bookings || [];
      const lastSeen = Number(localStorage.getItem(storageKey) || 0);

      const unseen = bookings.filter(
        (b) =>
          ["confirmed", "rejected"].includes(b.status) &&
          b.reviewedAt &&
          new Date(b.reviewedAt).getTime() > lastSeen
      );

      setUnseenBookings(unseen);
      setUnseenCount(unseen.length);
    } catch {
      // Silent — this is a nice-to-have indicator, not a critical path.
    }
  }, [user, storageKey]);

  useEffect(() => {
    if (!user || user.role !== "customer") return;
    checkForUpdates();
    // Poll while the tab is open so the badge updates without a manual refresh.
    const interval = setInterval(checkForUpdates, 45000);
    return () => clearInterval(interval);
  }, [user, checkForUpdates]);

  const markAllSeen = useCallback(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, String(Date.now()));
    setUnseenCount(0);
    setUnseenBookings([]);
  }, [storageKey]);

  return { unseenCount, unseenBookings, markAllSeen, refresh: checkForUpdates };
};
