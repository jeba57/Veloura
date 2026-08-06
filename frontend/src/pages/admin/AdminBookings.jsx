import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const statusColors = {
  pending: "bg-sand text-caramel",
  confirmed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-mocha/10 text-mocha/60",
};

const filters = ["pending", "confirmed", "rejected", "completed", "cancelled", "all"];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [status, setStatus] = useState("loading");
  const [actionError, setActionError] = useState({});
  const [busyId, setBusyId] = useState(null);

  const fetchBookings = async (f = filter) => {
    setStatus("loading");
    try {
      const res = await api.get("/admin/bookings", {
        params: f !== "all" ? { status: f } : {},
      });
      setBookings(res.data.bookings || []);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchBookings(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleApprove = async (id) => {
    setBusyId(id);
    setActionError((prev) => ({ ...prev, [id]: "" }));
    try {
      await api.patch(`/admin/bookings/${id}/approve`);
      fetchBookings();
    } catch (err) {
      setActionError((prev) => ({
        ...prev,
        [id]: err.response?.data?.message || "Failed to approve",
      }));
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection (optional):") || "";
    setBusyId(id);
    setActionError((prev) => ({ ...prev, [id]: "" }));
    try {
      await api.patch(`/admin/bookings/${id}/reject`, { reason });
      fetchBookings();
    } catch (err) {
      setActionError((prev) => ({
        ...prev,
        [id]: err.response?.data?.message || "Failed to reject",
      }));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-mocha mb-6">Booking Requests</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wide transition-colors ${
              filter === f ? "bg-mocha text-ivory" : "bg-white text-mocha/60 hover:bg-sand"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {status === "loading" && <p className="text-mocha/60">Loading bookings...</p>}
      {status === "error" && <p className="text-red-600">Failed to load bookings.</p>}
      {status === "success" && bookings.length === 0 && (
        <p className="text-mocha/60">No {filter !== "all" ? filter : ""} bookings found.</p>
      )}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b._id} className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-display text-xl text-mocha">{b.service?.name}</h3>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide font-semibold ${statusColors[b.status]}`}
                  >
                    {b.status}
                  </span>
                  {b.paymentStatus === "paid" && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide font-semibold bg-champagne/20 text-caramel">
                      Paid
                    </span>
                  )}
                </div>
                <p className="text-sm text-mocha/70">
                  {b.user?.name} • {b.user?.email} {b.user?.phone && `• ${b.user.phone}`}
                </p>
                <p className="text-sm text-mocha/60 mt-1">
                  {new Date(b.date).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}{" "}
                  • {b.timeSlot} • ₹{b.service?.price?.toLocaleString("en-IN")}
                </p>
                {b.notes && <p className="text-sm text-mocha/50 mt-1 italic">"{b.notes}"</p>}
                {b.rejectionReason && (
                  <p className="text-sm text-red-600 mt-1">Rejected: {b.rejectionReason}</p>
                )}
              </div>

              {b.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(b._id)}
                    disabled={busyId === b._id}
                    className="px-5 py-2.5 rounded-full bg-mocha text-ivory text-sm font-semibold hover:bg-caramel transition-colors disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(b._id)}
                    disabled={busyId === b._id}
                    className="px-5 py-2.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
            {actionError[b._id] && (
              <p className="text-sm text-red-600 mt-3">{actionError[b._id]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBookings;
