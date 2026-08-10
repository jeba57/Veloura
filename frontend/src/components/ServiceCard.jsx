import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ServiceCard = ({ service, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-3xl overflow-hidden bg-white/60 shadow-soft hover:shadow-glow transition-shadow duration-500"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          loading="eager"
         decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mocha/60 via-mocha/0 to-transparent" />
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full glass text-[11px] tracking-widest uppercase text-mocha font-medium">
          {service.category}
        </span>
        <span className="absolute bottom-4 right-4 text-ivory font-display text-xl">
          ₹{service.price.toLocaleString("en-IN")}
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display text-2xl text-mocha leading-tight">{service.name}</h3>
        </div>
        <p className="text-sm text-mocha/70 leading-relaxed mb-4 line-clamp-2">
          {service.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs tracking-wide text-caramel uppercase font-medium">
            {service.duration}
          </span>
          <Link
            to="/booking"
            state={{ serviceId: service._id, serviceName: service.name }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-mocha group-hover:text-caramel transition-colors"
          >
            Book Now
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-champagne/0 group-hover:ring-champagne/40 transition-all duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default ServiceCard;


