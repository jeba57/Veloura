import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const emptyForm = { name: "", email: "", phone: "", password: "" };

const AdminAccounts = () => {
  const [admins, setAdmins] = useState([]);
  const [status, setStatus] = useState("loading");
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchAdmins = async () => {
    setStatus("loading");
    try {
      const res = await api.get("/admin/admins");
      setAdmins(res.data.admins || []);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      await api.post("/admin/admins", form);
      setForm(emptyForm);
      fetchAdmins();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create admin");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id, name) => {
    if (!window.confirm(`Revoke admin access for ${name}? They'll become a regular customer.`))
      return;
    try {
      await api.delete(`/admin/admins/${id}`);
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove admin");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-mocha mb-2">Admin Accounts</h1>
      <p className="text-sm text-mocha/60 mb-6">
        Only Super Admins can create or remove admin accounts.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <h2 className="md:col-span-2 font-display text-xl text-mocha">Add New Admin</h2>
        <input
          required
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-xl border border-mocha/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-champagne"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-xl border border-mocha/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-champagne"
        />
        <input
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="rounded-xl border border-mocha/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-champagne"
        />
        <input
          required
          type="password"
          minLength={6}
          placeholder="Temporary password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="rounded-xl border border-mocha/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-champagne"
        />

        {formError && <p className="md:col-span-2 text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={saving}
          className="md:col-span-2 px-6 py-2.5 rounded-full bg-mocha text-ivory text-sm font-semibold hover:bg-caramel transition-colors disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create Admin"}
        </button>
      </form>

      {status === "loading" && <p className="text-mocha/60">Loading admin accounts...</p>}
      {status === "error" && <p className="text-red-600">Failed to load admin accounts.</p>}

      {status === "success" && (
        <div className="space-y-3">
          {admins.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl shadow-soft p-5 flex items-center justify-between">
              <div>
                <p className="font-medium text-mocha">
                  {a.name}{" "}
                  <span className="text-xs uppercase tracking-wide text-champagne ml-2">
                    {a.role.replace("_", " ")}
                  </span>
                </p>
                <p className="text-sm text-mocha/60">{a.email}</p>
              </div>
              {a.role !== "super_admin" && (
                <button
                  onClick={() => handleRemove(a.id, a.name)}
                  className="text-xs font-semibold text-red-600 hover:text-red-800"
                >
                  Revoke Access
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAccounts;
