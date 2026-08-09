import { motion } from "framer-motion";
import Hero from "../components/Hero.jsx";
import ServicesSection from "../components/ServicesSection.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Hero />

      {/* Trust strip */}
      <section className="bg-sand/50 py-6 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-3 text-xs tracking-[0.2em] uppercase text-mocha/60">
          <span>Certified Therapists</span>
          <span className="h-1 w-1 rounded-full bg-champagne" />
          <span>Premium Products</span>
          <span className="h-1 w-1 rounded-full bg-champagne" />
          <span>Hygienic & Private Rooms</span>
          <span className="h-1 w-1 rounded-full bg-champagne" />
          <span>500+ Happy Clients</span>
        </div>
      </section>

      <ServicesSection featuredOnly />

      {/* CTA banner */}
      <section className="relative py-24 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blush/40 via-sand/30 to-champagne/20" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl md:text-5xl text-mocha mb-6">
            Your moment of calm is one booking away
          </h2>
          <p className="text-mocha/70 mb-9 leading-relaxed">
            Reserve your seat at Veloura and step into a space made entirely for you.
          </p>
          <Link
            to="/booking"
            className="inline-block px-9 py-4 rounded-full bg-mocha text-ivory font-semibold text-sm tracking-wide hover:bg-caramel transition-all duration-300 shadow-soft hover:shadow-glow"
          >
            Book Your Appointment
          </Link>
        </motion.div>
      </section>
    </>
  );
};

export default Home;
