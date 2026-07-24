import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-mocha text-ivory/80 pt-16 pb-8 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div>
          <h3 className="font-display text-2xl text-ivory mb-3">Lumière Salon</h3>
          <p className="text-sm leading-relaxed text-ivory/60">
            A premium beauty and wellness sanctuary, crafted for quiet luxury and lasting glow.
          </p>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-champagne mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-champagne transition-colors">Home</Link></li>
            <li><Link to="/services" className="hover:text-champagne transition-colors">Services</Link></li>
            <li><Link to="/booking" className="hover:text-champagne transition-colors">Booking</Link></li>
            <li><Link to="/contact" className="hover:text-champagne transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-champagne mb-4">Hours</h4>
          <ul className="space-y-2 text-sm text-ivory/60">
            <li>Mon – Sat: 10:00 AM – 8:00 PM</li>
            <li>Sunday: 11:00 AM – 6:00 PM</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-champagne mb-4">Visit</h4>
          <p className="text-sm text-ivory/60 leading-relaxed">
            Park Street, Kolkata, West Bengal
            <br />
            +91 90000 00000
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-ivory/10 pt-6 text-xs text-ivory/40 flex flex-col sm:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} Lumière Salon. All rights reserved.</span>
        <span>Designed for a premium wellness experience.</span>
      </div>
    </footer>
  );
};

export default Footer;
