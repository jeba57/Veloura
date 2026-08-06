import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const emptyForm = {
  name: "",
  category: "Hair",
  shortDescription: "",
  description: "",
  image: "",
  price: "",
  duration: "",
  isFeatured: false,
};

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("loading");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    setStatus("loading");
    try {
      const res = await api.get("/services");
      setServices(res.data.services || []);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
  };

  const handleEdit = (service) => {
    setForm({
      name: service.name,
      category: service.category,
      shortDescription: service.shortDescription,
      description: service.description,
      image: service.image,
      price: service.price,
      duration: service.duration,
      isFeatured: service.isFeatured,
    });
    setEditingId(service._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service? This cannot be undone.")) return;
    try {
      await api.delete(`/services/${id}`);
      fetchServices();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete service");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        slug: slugify(form.name),
      };
      if (editingId) {
        await api.put(`/services/${editingId}`, payload);
      } else {
        await api.post("/services", payload);
      }
      resetForm();
      fetchServices();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-mocha mb-6">Manage Services</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <h2 className="md:col-span-2 font-display text-xl text-mocha">
          {editingId ? "Edit Service" : "Add New Service"}
        </h2>

        <input
          required
          placeholder="Service name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-xl border border-mocha/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-champagne"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="rounded-xl border border-mocha/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-champagne"
        >
          {["Hair", "Skin", "Nails", "Bridal", "Wellness"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          required
          type="number"
          placeholder="Price (₹)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="rounded-xl border border-mocha/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-champagne"
        />
        <input
          required
          placeholder="Duration (e.g. 60 min)"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          className="rounded-xl border border-mocha/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-champagne"
        />

        <input
          required
          placeholder="Image path (e.g. /images/hair-styling.jpg)"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="md:col-span-2 rounded-xl border border-mocha/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-champagne"
        />

        <input
          required
          maxLength={160}
          placeholder="Short description (max 160 chars)"
          value={form.shortDescription}
          onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
          className="md:col-span-2 rounded-xl border border-mocha/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-champagne"
        />

        <textarea
          required
          rows={3}
          placeholder="Full description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="md:col-span-2 rounded-xl border border-mocha/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-champagne resize-none"
        />

        <label className="flex items-center gap-2 text-sm text-mocha/70">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
          />
          Feature on homepage
        </label>

        {formError && <p className="md:col-span-2 text-sm text-red-600">{formError}</p>}

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-mocha text-ivory text-sm font-semibold hover:bg-caramel transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update Service" : "Add Service"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 rounded-full bg-sand text-mocha text-sm font-semibold hover:bg-sand/70 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {status === "loading" && <p className="text-mocha/60">Loading services...</p>}
      {status === "error" && <p className="text-red-600">Failed to load services.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <div key={s._id} className="bg-white rounded-2xl shadow-soft p-5 flex gap-4">
            <img src={s.image} alt={s.name} className="h-20 w-20 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg text-mocha truncate">{s.name}</h3>
              <p className="text-xs text-caramel uppercase tracking-wide">{s.category}</p>
              <p className="text-sm text-mocha/60">₹{s.price} • {s.duration}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="text-xs font-semibold text-mocha hover:text-caramel"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="text-xs font-semibold text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminServices;
