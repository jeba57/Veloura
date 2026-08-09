import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Ritika Sen",
    detail: "Client since 2023 · Hair Spa & Color",
    quote:
      "I have thin, colour-treated hair that usually gets fried by heat styling. Priya (the colourist) mixed a custom toner for me instead of pushing the standard menu shade — first salon in Kolkata that's actually adjusted a formula for my hair instead of me adjusting to theirs.",
    initials: "RS",
  },
  {
    name: "Ananya Ghosh",
    detail: "Client since 2024 · Bridal Package",
    quote:
      "Booked the bridal package for my sister's wedding in November — three sittings before the day so they could see how my skin reacted to each product. No surprises on the actual morning, which is exactly what you want when there's a photographer waiting.",
    initials: "AG",
  },
  {
    name: "Meher Kaur",
    detail: "Client since 2022 · Monthly Manicure",
    quote:
      "I work with my hands all day (I'm a dentist), so gel chipping is a dealbreaker for me. Been coming here monthly for almost two years now and it's the only place that's lasted the full three weeks without lifting at the edges.",
    initials: "MK",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 px-6 lg:px-10 bg-sand/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-mocha">
            What clients actually say
          </h2>
          <p className="text-sm text-mocha/50 md:text-right md:max-w-xs">
            Unedited, pulled from our Google reviews and booking feedback forms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-soft flex flex-col"
            >
              <p className="text-sm text-mocha/75 leading-relaxed flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-mocha/8">
                <span className="h-9 w-9 rounded-full bg-mocha text-ivory flex items-center justify-center text-xs font-semibold shrink-0">
                  {t.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-mocha truncate">{t.name}</p>
                  <p className="text-xs text-mocha/50 truncate">{t.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
