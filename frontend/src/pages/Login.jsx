import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
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
        <h1 className="font-display text-3xl text-mocha mb-2 text-center">Welcome Back</h1>
        <p className="text-sm text-mocha/60 text-center mb-8">
          Sign in to manage your bookings and profile.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <label className="block text-sm font-medium text-mocha mb-2">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-mocha/15 bg-white/70 px-4 py-3 text-mocha focus:outline-none focus:ring-2 focus:ring-champagne"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-mocha text-ivory font-semibold text-sm tracking-wide hover:bg-caramel transition-all duration-300 shadow-soft hover:shadow-glow disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-mocha/60 mt-8">
          New here?{" "}
          <Link to="/register" className="text-caramel font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
