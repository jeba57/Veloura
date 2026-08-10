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
    eyebrow: "Veloura",
    title: "A Space\nMade for You",
    subtitle:
      "A bright and comfortable for hair, skin, nails, makeup, and bridal services.",
    image: "/images/salon-interior.jpg",
  },

{
    id: 2,
    eyebrow: "Nail Care",
    title: "Careful Work.\nClean Finish.",
    subtitle:
      "Manicure, pedicure, and nail services with careful preparation and professional tools.",
    image: "/images/nail-care.jpg",
  },


  {
    id: 3,
    eyebrow: "Makeup",
    title: "Makeup\nFor Every Occasion",
    subtitle:
      "From everyday looks to special events, our artists focus on clean, detailed finishes.",
    image: "/images/makeup-service.jpg",
  },
  
  {
    id: 4,
    eyebrow: "Products",
    title: "Professional\nProducts",
    subtitle:
      "We use professional hair, skin, and nail products selected for the services we offer.",
    image: "/images/salon-products.jpg",
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
  style={{
    backgroundImage: `url(${slides[0].image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
        fadeEffect={{ crossFade: true }}
        speed={1200}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="hero-swiper h-full w-full"
      >
    {slides.map((slide) => (
  <SwiperSlide key={slide.id}>
    <div
      className="absolute inset-0 bg-cover bg-center hero-kenburns"
      style={{ backgroundImage: `url(${slide.image})` }}
    />

    <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
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
                  className="hero-cta group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-champagne text-mocha font-semibold text-sm tracking-wide hover:bg-ivory transition-all duration-300 shadow-glow overflow-hidden"
                >
                  <span className="relative z-10">Book Appointment</span>
                  <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
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
        .hero-kenburns {
          animation: kenBurns 20s ease-in-out infinite alternate;
        }
        @keyframes kenBurns {
          0% { transform: scale(1) translate(0%, 0%); }
          100% { transform: scale(1.14) translate(-1.5%, -1%); }
        }

        .hero-glow {
          position: absolute;
          width: 50%;
          height: 50%;
          border-radius: 50%;
          filter: blur(65px);
          mix-blend-mode: screen;
          will-change: transform, opacity;
        }
        .hero-glow-a {
          top: -14%;
          left: -14%;
          background: radial-gradient(circle, rgba(255,248,240,0.9) 0%, rgba(201,160,99,0.6) 40%, transparent 72%);
          animation: auroraDriftA 14s ease-in-out infinite;
        }
        .hero-glow-b {
          bottom: -16%;
          right: -14%;
          background: radial-gradient(circle, rgba(201,160,99,0.8) 0%, rgba(232,201,168,0.55) 42%, transparent 72%);
          animation: auroraDriftB 17s ease-in-out infinite;
        }
        @keyframes auroraDriftA {
          0%, 100% { transform: translate(0%, 0%) scale(1); opacity: 0.4; }
          50% { transform: translate(6%, 5%) scale(1.15); opacity: 0.6; }
        }
        @keyframes auroraDriftB {
          0%, 100% { transform: translate(0%, 0%) scale(1); opacity: 0.35; }
          50% { transform: translate(-5%, -6%) scale(1.12); opacity: 0.55; }
        }

        .hero-sheen {
          position: absolute;
          inset: -50%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(255,248,240,0.12) 50deg,
            transparent 110deg,
            transparent 250deg,
            rgba(201,160,99,0.1) 310deg,
            transparent 360deg
          );
          mix-blend-mode: screen;
          animation: auroraRotate 24s linear infinite;
        }
        @keyframes auroraRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }



.hero-sunlight-ray {
  position: absolute;
  inset: -30%;
  background: linear-gradient(
    120deg,
    transparent 34%,
    rgba(255, 248, 240, 0.25) 44%,
    rgba(255, 255, 255, 0.72) 50%,
    rgba(255, 248, 240, 0.38) 56%,
    transparent 66%
  );
  mix-blend-mode: screen;
  filter: blur(20px);
  transform: translateX(-35%);
  animation: sunlightSweep 10s ease-in-out infinite;
  will-change: transform, opacity;
}

@keyframes sunlightSweep {
  0% {
    transform: translateX(-35%);
    opacity: 0.15;
  }

  50% {
    transform: translateX(20%);
    opacity: 0.35;
  }

  100% {
    transform: translateX(-35%);
    opacity: 0.15;
  }
}


        .hero-cta::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 20%,
            rgba(201, 160, 99, 0.55) 45%,
            rgba(139, 94, 60, 0.5) 52%,
            transparent 75%
          );
          transform: translateX(-120%);
          animation: ctaShimmer 4.5s ease-in-out infinite;
        }
        @keyframes ctaShimmer {
          0%, 40% { transform: translateX(-120%); }
          60%, 100% { transform: translateX(120%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-kenburns, .hero-glow, .hero-sheen, .hero-cta::before {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
