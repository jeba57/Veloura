import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-mocha text-ivory/80 pt-16 pb-8 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

        {/* Brand */}
        <div>
          <h3 className="font-display text-2xl text-ivory mb-3">
            Veloura
          </h3>

          <p className="text-sm leading-relaxed text-ivory/60 max-w-xs">
            Hair, skin, nail, makeup, and bridal services in one comfortable
            salon space.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-champagne mb-4">
            Explore
          </h4>

          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-champagne transition-colors">
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/services"
                className="hover:text-champagne transition-colors"
              >
                Services
              </Link>
            </li>

            <li>
              <Link
                to="/booking"
                className="hover:text-champagne transition-colors"
              >
                Booking
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="hover:text-champagne transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-champagne mb-4">
            Services
          </h4>

          <ul className="space-y-2 text-sm text-ivory/60">
            <li>Hair Care</li>
            <li>Skin & Facial Care</li>
            <li>Nail Care</li>
            <li>Makeup & Bridal</li>
          </ul>
        </div>

        {/* Visit */}
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-champagne mb-4">
            Visit
          </h4>

          <p className="text-sm text-ivory/60 leading-relaxed">
            Kolkata, West Bengal
            <br />
            By appointment
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-ivory/10 pt-6 text-xs text-ivory/40 flex flex-col sm:flex-row justify-between gap-2">
        <span>
          © {new Date().getFullYear()} Veloura. All rights reserved.
        </span>

        <span>
          Beauty services made simple.
        </span>
      </div>
    </footer>
  );
};

export default Footer;