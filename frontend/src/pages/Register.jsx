import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 bg-gradient-to-br from-ivory via-sand/40 to-blush/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass rounded-3xl shadow-soft p-10"
      >
        <h1 className="font-display text-3xl text-mocha mb-2 text-center">Create Account</h1>
        <p className="text-sm text-mocha/60 text-center mb-8">
          Join Veloura to book and manage your appointments.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-mocha mb-2">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-mocha/15 bg-white/70 px-4 py-3 text-mocha focus:outline-none focus:ring-2 focus:ring-champagne"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mocha mb-2">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-mocha/15 bg-white/70 px-4 py-3 text-mocha focus:outline-none focus:ring-2 focus:ring-champagne"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mocha mb-2">Phone (optional)</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-mocha/15 bg-white/70 px-4 py-3 text-mocha focus:outline-none focus:ring-2 focus:ring-champagne"
              placeholder="+91 90000 00000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mocha mb-2">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-mocha/15 bg-white/70 px-4 py-3 text-mocha focus:outline-none focus:ring-2 focus:ring-champagne"
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-mocha text-ivory font-semibold text-sm tracking-wide hover:bg-caramel transition-all duration-300 shadow-soft hover:shadow-glow disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-mocha/60 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-caramel font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
