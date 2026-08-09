import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios.js";
import ServiceCard from "./ServiceCard.jsx";

const ServicesSection = ({ featuredOnly = true }) => {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error | empty

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services", {
          params: featuredOnly ? { featured: true } : {},
        });
        setServices(res.data.services || []);
        setStatus(res.data.services?.length ? "success" : "empty");
      } catch (err) {
        setStatus("error");
      }
    };
    fetchServices();
  }, [featuredOnly]);

  return (
    <section className="relative py-24 px-6 lg:px-10 bg-ivory">
      <div className="max-w-7xl mx-auto">
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  className="max-w-7xl mx-auto mb-12 px-1"
>
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
    <div>
      <p className="text-xs tracking-[0.18em] uppercase text-caramel mb-3">
        Our Services
      </p>

      <h2 className="font-display text-4xl md:text-5xl text-mocha leading-tight">
        What we offer
      </h2>
    </div>

    <p className="text-mocha/65 text-sm md:text-base leading-relaxed max-w-md md:text-right">
      Hair, skin, nails, makeup, and bridal services — choose what you need
      and book your preferred time.
    </p>
  </div>
</motion.div>

        {status === "loading" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-sand/60 animate-pulse" />
            ))}
          </div>
        )}

        {status === "error" && (
          <p className="text-center text-caramel">
            We couldn't load services right now. Please make sure the backend server is running.
          </p>
        )}

        {status === "empty" && (
          <p className="text-center text-mocha/60">
            No services published yet — run <code className="text-caramel">npm run seed</code> in
            the backend to add sample treatments.
          </p>
        )}

        {status === "success" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <ServiceCard key={service._id} service={service} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
