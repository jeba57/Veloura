import { motion } from "framer-motion";

const ContactPage = () => {
  return (
    <div className="min-h-screen px-6 lg:px-10 py-28">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.18em] uppercase text-caramel mb-4">
            Get In Touch
          </p>

          <h1 className="font-display text-4xl md:text-5xl text-mocha mb-6">
            Contact Veloura
          </h1>

          <p className="text-mocha/70 leading-relaxed max-w-md mb-10">
            Have a question about a service, booking, or bridal appointment?
            Get in touch with us and we'll be happy to help.
          </p>

          <div className="space-y-7">

            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-caramel mb-2">
                Address
              </p>
              <p className="text-sm text-mocha/70">
                Kolkata, West Bengal, India
              </p>
            </div>

            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-caramel mb-2">
                Phone
              </p>
              <p className="text-sm text-mocha/70">
                Contact us for appointment assistance
              </p>
            </div>

            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-caramel mb-2">
                Email
              </p>
              <p className="text-sm text-mocha/70">
                jebakhatun57@gmail.com
              </p>
            </div>

            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-caramel mb-2">
                Hours
              </p>
              <p className="text-sm text-mocha/70">
                Mon–Sat: 10 AM–8 PM · Sun: 11 AM–6 PM
              </p>
            </div>

          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/70 border border-mocha/10 rounded-2xl p-8 space-y-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label className="block text-sm font-medium text-mocha mb-2">
              Name
            </label>

            <input
              type="text"
              required
              className="w-full rounded-xl border border-mocha/15 bg-white px-4 py-3 text-mocha focus:outline-none focus:ring-2 focus:ring-champagne"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mocha mb-2">
              Email
            </label>

            <input
              type="email"
              required
              className="w-full rounded-xl border border-mocha/15 bg-white px-4 py-3 text-mocha focus:outline-none focus:ring-2 focus:ring-champagne"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mocha mb-2">
              Message
            </label>

            <textarea
              rows={4}
              required
              className="w-full rounded-xl border border-mocha/15 bg-white resize-none px-4 py-3 text-mocha focus:outline-none focus:ring-2 focus:ring-champagne"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-mocha text-ivory font-semibold text-sm tracking-wide hover:bg-caramel transition-colors duration-300"
          >
            Send Message
          </button>
        </motion.form>

      </div>
    </div>
  );
};

export default ContactPage;