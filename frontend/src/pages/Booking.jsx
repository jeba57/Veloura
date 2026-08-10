import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useBookingNotifications } from "../hooks/useBookingNotifications.js";

const timeSlots = [
  "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM",
  "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM",
];

const statusStyles = {
  pending: { label: "Pending Review", classes: "bg-sand text-caramel" },
  confirmed: { label: "Confirmed", classes: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", classes: "bg-red-100 text-red-700" },
  completed: { label: "Completed", classes: "bg-blue-100 text-blue-700" },
  cancelled: { label: "Cancelled", classes: "bg-mocha/10 text-mocha/60" },
};

// Loads the Razorpay checkout script exactly once, even across remounts.
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.getElementById("razorpay-checkout-script");
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const BookingPage = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { markAllSeen } = useBookingNotifications();

  const [services, setServices] = useState([]);
  const [servicesStatus, setServicesStatus] = useState("loading");
  const [form, setForm] = useState({
    serviceId: location.state?.serviceId || "",
    date: "",
    timeSlot: "",
    notes: "",
  });

  const [myBookings, setMyBookings] = useState([]);
  const [bookingsStatus, setBookingsStatus] = useState("loading");

  const [submitState, setSubmitState] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [payingId, setPayingId] = useState(null);
  const [payError, setPayError] = useState({});

  const fetchBookings = () => {
    setBookingsStatus("loading");
    api
      .get("/bookings/my-bookings")
      .then((res) => {
        setMyBookings(res.data.bookings || []);
        setBookingsStatus("success");
      })
      .catch(() => setBookingsStatus("error"));
  };

  useEffect(() => {
    api
      .get("/services")
      .then((res) => {
        setServices(res.data.services || []);
        setServicesStatus("success");
      })
      .catch(() => setServicesStatus("error"));

    fetchBookings();
    markAllSeen();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitState("submitting");
    setErrorMsg("");
    try {
      const res = await api.post("/bookings", form);
      setMyBookings((prev) => [res.data.booking, ...prev]);
      setForm({ serviceId: "", date: "", timeSlot: "", notes: "" });
      setSubmitState("success");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Something went wrong. Please try again.");
      setSubmitState("error");
    }
  };

  // Payment only ever runs for a booking the admin already confirmed —
  // the button itself is only rendered in that state (see below).
  const handlePayment = async (booking) => {
    setPayingId(booking._id);
    setPayError((prev) => ({ ...prev, [booking._id]: "" }));

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Payment gateway failed to load. Please refresh and try again.");
      }

      const { data } = await api.post("/payments/create-order", { bookingId: booking._id });

      const razorpay = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "Veloura",
        description: data.serviceName,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#8B5E3C" },
        handler: async (response) => {
          try {
            await api.post("/payments/verify", {
              bookingId: booking._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            fetchBookings();
          } catch (err) {
            setPayError((prev) => ({
              ...prev,
              [booking._id]: "Payment verification failed. Contact us if the amount was deducted.",
            }));
          }
        },
        modal: {
          ondismiss: () => setPayingId(null),
        },
      });

      razorpay.open();
    } catch (err) {
      setPayError((prev) => ({
        ...prev,
        [booking._id]: err.response?.data?.message || err.message || "Unable to start payment.",
      }));
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="pt-24 pb-16 px-6 lg:px-10 bg-ivory min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="text-champagne text-xs tracking-[0.3em] uppercase font-medium">
            Reserve Your Ritual
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-mocha mt-2">Book an Appointment</h1>
        </motion.div>

        {/* Two-column on desktop: form left, bookings list right (sticky) — avoids one long, sparse centered column */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <form
            onSubmit={handleSubmit}
            className="glass rounded-3xl shadow-soft p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-mocha mb-2">Select Service</label>
              {servicesStatus === "loading" ? (
                <div className="h-12 rounded-xl bg-sand/60 animate-pulse" />
              ) : (
                <select
                  name="serviceId"
                  value={form.serviceId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-mocha/15 bg-white/70 px-4 py-3 text-mocha focus:outline-none focus:ring-2 focus:ring-champagne"
                >
                  <option value="">Choose a treatment...</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} — ₹{s.price} ({s.duration})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-mocha mb-2">Preferred Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
                className="w-full rounded-xl border border-mocha/15 bg-white/70 px-4 py-3 text-mocha focus:outline-none focus:ring-2 focus:ring-champagne"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mocha mb-2">Preferred Time</label>
              <select
                name="timeSlot"
                value={form.timeSlot}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-mocha/15 bg-white/70 px-4 py-3 text-mocha focus:outline-none focus:ring-2 focus:ring-champagne"
              >
                <option value="">Select a slot...</option>
                {timeSlots.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-mocha mb-2">Notes (optional)</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any preferences or concerns we should know about?"
                className="w-full rounded-xl border border-mocha/15 bg-white/70 px-4 py-3 text-mocha focus:outline-none focus:ring-2 focus:ring-champagne resize-none"
              />
            </div>

            {submitState === "error" && (
              <p className="sm:col-span-2 text-sm text-red-600">{errorMsg}</p>
            )}
            {submitState === "success" && (
              <p className="sm:col-span-2 text-sm text-green-700">
                Your appointment request has been sent for approval. You'll be able to pay once
                the salon confirms your slot.
              </p>
            )}

            <button
              type="submit"
              disabled={submitState === "submitting"}
              className="sm:col-span-2 mt-1 px-8 py-3.5 rounded-full bg-mocha text-ivory font-semibold text-sm tracking-wide hover:bg-caramel transition-all duration-300 shadow-soft hover:shadow-glow disabled:opacity-60"
            >
              {submitState === "submitting" ? "Sending Request..." : "Request Booking"}
            </button>
          </form>

          <div className="lg:sticky lg:top-24">
            <h2 className="font-display text-2xl text-mocha mb-5">My Bookings</h2>

            {bookingsStatus === "loading" && (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-24 rounded-2xl bg-sand/60 animate-pulse" />
                ))}
              </div>
            )}

            {bookingsStatus === "error" && (
              <p className="text-sm text-red-600">Couldn't load your bookings. Please refresh.</p>
            )}

            {bookingsStatus === "success" && myBookings.length === 0 && (
              <div className="rounded-2xl border border-dashed border-mocha/15 p-8 text-center">
                <p className="text-sm text-mocha/50">No bookings yet — your requests will show up here.</p>
              </div>
            )}

            {bookingsStatus === "success" && myBookings.length > 0 && (
              <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                {myBookings.map((b) => {
                  const style = statusStyles[b.status] || statusStyles.pending;
                  return (
                    <div key={b._id} className="rounded-2xl bg-white/70 shadow-soft p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-mocha truncate">{b.service?.name}</p>
                          <p className="text-sm text-mocha/60 mt-0.5">
                            {new Date(b.date).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })}{" "}
                            • {b.timeSlot}
                          </p>
                          {b.service?.price && (
                            <p className="text-sm text-mocha/50">₹{b.service.price.toLocaleString("en-IN")}</p>
                          )}
                        </div>
                        <span
                          className={`shrink-0 text-xs px-3 py-1 rounded-full uppercase tracking-wide font-medium ${style.classes}`}
                        >
                          {style.label}
                        </span>
                      </div>

                      {b.status === "rejected" && b.rejectionReason && (
                        <p className="text-sm text-red-600 mt-2">Reason: {b.rejectionReason}</p>
                      )}

                      {/* Payment only unlocks once the admin has confirmed the booking */}
                      {b.status === "confirmed" && b.paymentStatus !== "paid" && (
                        <div className="mt-4 pt-4 border-t border-mocha/10">
                          <button
                            onClick={() => handlePayment(b)}
                            disabled={payingId === b._id}
                            className="px-5 py-2 rounded-full bg-mocha text-ivory text-xs font-semibold hover:bg-caramel transition-colors disabled:opacity-60"
                          >
                            {payingId === b._id ? "Opening payment..." : "Pay Now"}
                          </button>
                          {payError[b._id] && (
                            <p className="text-xs text-red-600 mt-2">{payError[b._id]}</p>
                          )}
                        </div>
                      )}

                      {b.paymentStatus === "paid" && (
                        <p className="text-xs font-semibold text-champagne mt-3">✓ Paid</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
