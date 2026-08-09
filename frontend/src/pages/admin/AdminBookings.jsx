import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios.js";

const statusColors = {
  pending: "bg-sand text-caramel",
  confirmed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-mocha/10 text-mocha/60",
};

const filters = ["pending", "confirmed", "rejected", "completed", "cancelled", "all"];

const isOverdue = (booking) =>
  booking.status === "pending" &&
  Date.now() - new Date(booking.createdAt).getTime() > 24 * 60 * 60 * 1000;

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]); // for the stats bar, independent of filter
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

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/bookings");
      setAllBookings(res.data.bookings || []);
    } catch {
      // stats bar is a nice-to-have, fail silently
    }
  };

  useEffect(() => {
    fetchBookings(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const pendingCount = allBookings.filter((b) => b.status === "pending").length;
    const overdueCount = allBookings.filter(isOverdue).length;
    const confirmedThisWeek = allBookings.filter(
      (b) => b.status === "confirmed" && new Date(b.reviewedAt || b.createdAt) >= startOfWeek
    ).length;
    const revenueThisWeek = allBookings
      .filter((b) => b.paymentStatus === "paid" && new Date(b.createdAt) >= startOfWeek)
      .reduce((sum, b) => sum + (b.service?.price || 0), 0);

    return { pendingCount, overdueCount, confirmedThisWeek, revenueThisWeek };
  }, [allBookings]);

  const refreshAll = () => {
    fetchBookings();
    fetchStats();
  };

  const handleApprove = async (id) => {
    setBusyId(id);
    setActionError((prev) => ({ ...prev, [id]: "" }));
    try {
      await api.patch(`/admin/bookings/${id}/approve`);
      refreshAll();
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
      refreshAll();
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

      {/* Overview stats — what an admin actually opens this dashboard to see first */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-soft p-5">
          <p className="text-xs uppercase tracking-wide text-mocha/50 mb-1">Awaiting Review</p>
          <p className="font-display text-3xl text-mocha">{stats.pendingCount}</p>
        </div>
        <div
          className={`rounded-2xl shadow-soft p-5 ${
            stats.overdueCount > 0 ? "bg-red-50 ring-1 ring-red-200" : "bg-white"
          }`}
        >
          <p className={`text-xs uppercase tracking-wide mb-1 ${stats.overdueCount > 0 ? "text-red-500" : "text-mocha/50"}`}>
            Over 24h Old
          </p>
          <p className={`font-display text-3xl ${stats.overdueCount > 0 ? "text-red-600" : "text-mocha"}`}>
            {stats.overdueCount}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-5">
          <p className="text-xs uppercase tracking-wide text-mocha/50 mb-1">Confirmed This Week</p>
          <p className="font-display text-3xl text-mocha">{stats.confirmedThisWeek}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-5">
          <p className="text-xs uppercase tracking-wide text-mocha/50 mb-1">Revenue This Week</p>
          <p className="font-display text-3xl text-mocha">
            ₹{stats.revenueThisWeek.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

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
          <div
            key={b._id}
            className={`bg-white rounded-2xl shadow-soft p-6 border-l-4 ${
              isOverdue(b) ? "border-red-400" : b.status === "pending" ? "border-champagne" : "border-transparent"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
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
                  {isOverdue(b) && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide font-semibold bg-red-100 text-red-600">
                      Waiting 24h+
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
