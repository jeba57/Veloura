import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios.js";
import ServiceCard from "../components/ServiceCard.jsx";

const categories = ["All", "Hair", "Skin", "Nails", "Bridal", "Wellness"];

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("loading");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchServices = async () => {
      setStatus("loading");
      try {
        const params = activeCategory !== "All" ? { category: activeCategory } : {};
        const res = await api.get("/services", { params });
        setServices(res.data.services || []);
        setStatus(res.data.services?.length ? "success" : "empty");
      } catch (err) {
        setStatus("error");
      }
    };
    fetchServices();
  }, [activeCategory]);

  return (
    <div className="pt-32 pb-24 px-6 lg:px-10 bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-champagne text-xs tracking-[0.3em] uppercase font-medium">
            All Treatments
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-mocha mt-4">
            Explore Our Services
          </h1>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-mocha text-ivory shadow-soft"
                  : "bg-sand/60 text-mocha/70 hover:bg-sand"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {status === "loading" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
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
          <p className="text-center text-mocha/60">No services found in this category.</p>
        )}

        {status === "success" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <ServiceCard key={service._id} service={service} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
