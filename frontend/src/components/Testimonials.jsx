import { motion } from "framer-motion";

const feedbackPoints = [
  {
    title: "Personalised service",
    text: "Services can be selected based on your hair, skin, nail, or makeup needs rather than using a one-size-fits-all approach.",
  },
  {
    title: "Careful preparation",
    text: "From consultation to the final finish, each appointment is planned around the service you choose.",
  },
  {
    title: "Easy appointment booking",
    text: "Choose your service, select a convenient time, and request your appointment online.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 md:py-24 px-6 lg:px-10 bg-sand/30">
      <div className="max-w-6xl mx-auto">

        {/* Section introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mb-12"
        >
          <p className="text-xs tracking-[0.18em] uppercase text-caramel mb-3">
            The Veloura Experience
          </p>

          <h2 className="font-display text-4xl md:text-5xl text-mocha leading-tight">
            What you can expect
          </h2>
        </motion.div>

        {/* Experience points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {feedbackPoints.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              className={`bg-white p-6 md:p-7 ${
                index === 1
                  ? "md:translate-y-6"
                  : ""
              }`}
            >
              <span className="text-xs text-caramel font-medium">
                0{index + 1}
              </span>

              <h3 className="font-display text-2xl text-mocha mt-8 mb-3">
                {item.title}
              </h3>

              <p className="text-sm text-mocha/65 leading-relaxed">
                {item.text}
              </p>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;