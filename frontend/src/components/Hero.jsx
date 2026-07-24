import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    eyebrow: "Hair Ritual",
    title: "Silk-Smooth\nHair Spa",
    subtitle:
      "A deep-conditioning ritual of steam, scalp massage, and nourishment — for hair that moves like light.",
    image: "/images/hair-styling.jpg",
  },
  {
    id: 2,
    eyebrow: "Hand & Nail Care",
    title: "Luxe\nManicure",
    subtitle:
      "Precision shaping, cuticle care, and a polish finish as refined as your everyday grace.",
    image: "/images/manicure.jpg",
  },
  {
    id: 3,
    eyebrow: "Skin Wellness",
    title: "Radiance\nFacial",
    subtitle: "A multi-step glow ritual that leaves skin calm, clear, and quietly luminous.",
    image: "/images/facial-spa.jpg",
  },
  {
    id: 4,
    eyebrow: "Bridal & Beyond",
    title: "The Bridal\nGlow Package",
    subtitle: "A complete pampering journey, designed for the days that deserve your best self.",
    image: "/images/skincare.jpg",
  },
];

const titleVariants = {
  enter: { opacity: 0, y: 30 },
  center: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = slides[activeIndex];

  return (
    <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden bg-mocha">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1200}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="hero-swiper h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-mocha/80 via-mocha/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-mocha/70 via-transparent to-mocha/20" />
            {/* Signature sunlight sweep, echoing the reference photos' window light */}
            <div className="absolute inset-0 bg-sunlight-sweep opacity-60 animate-[sweep_9s_ease-in-out_infinite] pointer-events-none" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Text content overlay, synced to active slide */}
      <div className="absolute inset-0 z-10 flex items-center pointer-events-none">
        <div className="max-w-7xl w-full mx-auto px-6 lg:px-10">
          <div className="max-w-xl pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial="enter"
                animate="center"
                exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
                variants={titleVariants}
              >
                <span className="inline-block text-champagne text-xs tracking-[0.3em] uppercase font-medium mb-4">
                  {active.eyebrow}
                </span>
                <h1 className="text-ivory font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] whitespace-pre-line mb-6">
                  {active.title}
                </h1>
                <p className="text-ivory/80 text-base md:text-lg leading-relaxed mb-9 max-w-md">
                  {active.subtitle}
                </p>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-champagne text-mocha font-semibold text-sm tracking-wide hover:bg-ivory transition-all duration-300 shadow-glow"
                >
                  Book Appointment
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-6 lg:right-10 z-10 text-ivory/70 font-display text-sm tracking-widest">
        <span className="text-ivory text-lg">{String(activeIndex + 1).padStart(2, "0")}</span>
        {" / "}
        {String(slides.length).padStart(2, "0")}
      </div>

      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-30%); }
          50% { transform: translateX(30%); }
          100% { transform: translateX(-30%); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
