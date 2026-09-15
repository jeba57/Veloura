import { motion } from "framer-motion";
import Hero from "../components/Hero.jsx";
import ServicesSection from "../components/ServicesSection.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Hero />

      {/* Trust strip */}
<section className="border-y border-mocha/10 bg-sand/30 px-6 lg:px-10">
  <div className="max-w-6xl mx-auto py-5 flex flex-wrap items-center justify-center md:justify-between gap-4 text-sm text-mocha/70">
    <span>Hair & Beauty</span>
    <span>Skin & Facial Care</span>
    <span>Nail Services</span>
    <span>Bridal Services</span>
  </div>
</section>

{/* Story / introduction section */}
<section className="py-20 md:py-28 px-6 lg:px-10 bg-ivory overflow-hidden">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">

    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className="md:col-span-5"
    >
      <div className="overflow-hidden rounded-[2rem] aspect-[4/5]">
        <img
          src="/images/salon-interior.webp"
          alt="Veloura salon interior"
          className="h-full w-full object-cover"
        />
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="md:col-span-7 md:pl-4"
    >
      <p className="text-xs tracking-[0.2em] uppercase text-caramel mb-4">
        About Veloura
      </p>

      <h2 className="font-display text-3xl md:text-5xl text-mocha leading-tight mb-6">
        Beauty services, without the rush.
      </h2>

      <p className="text-mocha/70 leading-relaxed max-w-xl mb-5">
        Veloura brings hair, skin, nail, makeup, and bridal services together
        in one comfortable Veloura setting.
      </p>

      <p className="text-mocha/70 leading-relaxed max-w-xl mb-8">
        Choose a service, select a convenient time, and request your
        appointment online. Our goal is simple: make booking easy and visit.
      </p>

      <Link
  to="/services"
  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-mocha text-ivory text-sm font-semibold hover:bg-caramel transition-colors duration-300"
>
  
  Explore our services
  <span>→</span>
</Link>
    </motion.div>

  </div>
</section>
    </>
  );
};

export default Home;
