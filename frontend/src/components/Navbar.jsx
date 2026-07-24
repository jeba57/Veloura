import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Booking", to: "/booking" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between rounded-full transition-all duration-500 ${
          scrolled ? "glass shadow-soft py-3 px-6 lg:px-8" : "py-1"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-2xl md:text-3xl tracking-wide text-mocha">
            Lumière
          </span>
          <span className="hidden sm:inline text-[10px] tracking-[0.3em] uppercase text-champagne self-end mb-1">
            Salon
          </span>
        </Link>

        {/* Center nav - desktop */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative font-body text-sm tracking-wide transition-colors group ${
                  isActive ? "text-caramel" : "text-mocha/80 hover:text-caramel"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-champagne transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right - auth */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-mocha/80 hover:text-caramel transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-5 py-2 rounded-full bg-mocha text-ivory hover:bg-caramel transition-all duration-300 shadow-soft hover:shadow-glow"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-sand/60 hover:bg-sand transition-colors"
              >
                <span className="h-7 w-7 rounded-full bg-champagne text-ivory flex items-center justify-center text-xs font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-mocha">{user.name?.split(" ")[0]}</span>
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-48 rounded-2xl glass shadow-soft py-2 overflow-hidden"
                  >
                    <Link
                      to="/account"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-mocha hover:bg-champagne/10"
                    >
                      My Account
                    </Link>
                    <Link
                      to="/booking"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-mocha hover:bg-champagne/10"
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-caramel hover:bg-champagne/10"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden h-10 w-10 flex items-center justify-center rounded-full bg-sand/60"
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-px w-5 bg-mocha transition-transform ${
                mobileOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span className={`block h-px w-5 bg-mocha transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
            <span
              className={`block h-px w-5 bg-mocha transition-transform ${
                mobileOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mx-4 mt-2 rounded-3xl glass shadow-soft overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-mocha text-base font-medium"
                >
                  {link.label}
                </NavLink>
              ))}
              <hr className="border-mocha/10" />
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-mocha">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="text-center px-5 py-2.5 rounded-full bg-mocha text-ivory"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/account" onClick={() => setMobileOpen(false)} className="text-mocha">
                    My Account
                  </Link>
                  <button onClick={handleLogout} className="text-left text-caramel">
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
