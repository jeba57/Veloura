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

const BookingPage = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { markAllSeen } = useBookingNotifications();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    serviceId: location.state?.serviceId || "",
    date: "",
    timeSlot: "",
    notes: "",
  });
  const [myBookings, setMyBookings] = useState([]);
  const [submitState, setSubmitState] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);

  api.get("/services").then((res) => setServices(res.data.services || [])).catch(() => {});
  api
    .get("/bookings/my-bookings")
    .then((res) => setMyBookings(res.data.bookings || []))
    .catch(() => {});
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

  const handlePayment = async (booking) => {
   try {
    // 1. Create Razorpay Order
    const { data } = await api.post("/payment/create-order", {
      bookingId: booking._id,
    });

    // 2. Configure Razorpay Checkout
    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "Veloura Salon",
      description: data.serviceName,
      order_id: data.orderId,

      handler: async function (response) {
        try {
          // 3. Verify Payment
          await api.post("/payment/verify", {
            bookingId: data.bookingId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          // Refresh bookings after successful payment
          const res = await api.get("/bookings/my-bookings");
          setMyBookings(res.data.bookings || []);

          alert("Payment Successful!");
        } catch (err) {
          alert(err.response?.data?.message || "Payment verification failed.");
        }
      },

      prefill: {
        name: "",
        email: "",
      },

      theme: {
        color: "#8B5E3C",
      },
    };

    // 4. Open Razorpay Checkout
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (err) {
    alert(err.response?.data?.message || "Unable to start payment.");
  }
};

  return (
    <div className="pt-32 pb-24 px-6 lg:px-10 bg-ivory min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-champagne text-xs tracking-[0.3em] uppercase font-medium">
            Reserve Your Ritual
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-mocha mt-4">Book an Appointment</h1>
        </motion.div>

        <form
          onSubmit={handleSubmit}
          className="glass rounded-3xl shadow-soft p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-mocha mb-2">Select Service</label>
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

          <div className="md:col-span-2">
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
            <p className="md:col-span-2 text-sm text-red-600">{errorMsg}</p>
          )}
          {submitState === "success" && (
            <p className="md:col-span-2 text-sm text-green-700">
              Your appointment request has been received. We'll confirm shortly.
            </p>
          )}

          <button
            type="submit"
            disabled={submitState === "submitting"}
            className="md:col-span-2 mt-2 px-8 py-3.5 rounded-full bg-mocha text-ivory font-semibold text-sm tracking-wide hover:bg-caramel transition-all duration-300 shadow-soft hover:shadow-glow disabled:opacity-60"
          >
            {submitState === "submitting" ? "Booking..." : "Confirm Booking"}
          </button>
        </form>

        {myBookings.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl text-mocha mb-6">My Bookings</h2>
            <div className="space-y-4">
              {myBookings.map((b) => (
                <div
                  key={b._id}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-white/60 shadow-soft p-5"
                >
                  <div>
                    <p className="font-medium text-mocha">{b.service?.name}</p>
                    <p className="text-sm text-mocha/60">
                      {new Date(b.date).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}{" "}
                      • {b.timeSlot}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
  <span
    className={`text-xs px-3 py-1 rounded-full uppercase tracking-wide font-medium ${
      b.status === "confirmed"
        ? "bg-green-100 text-green-700"
        : b.status === "cancelled"
        ? "bg-red-100 text-red-700"
        : b.status === "rejected"
        ? "bg-red-100 text-red-700"
        : "bg-sand text-caramel"
    }`}
  >
    {b.status}
  </span>

  {b.status === "confirmed" && b.paymentStatus === "pending" && (
    <button
      onClick={() => handlePayment(b)}
      className="px-4 py-2 rounded-full bg-mocha text-white text-xs font-semibold hover:bg-caramel transition"
    >
      Pay Now
    </button>
  )}

  {b.paymentStatus === "paid" && (
    <span className="text-green-600 text-xs font-semibold">
      ✅ Paid
    </span>
  )}
</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
