import { motion } from "framer-motion";

const ContactPage = () => {
  return (
    <div className="pt-32 pb-24 px-6 lg:px-10 bg-ivory min-h-screen">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-champagne text-xs tracking-[0.3em] uppercase font-medium">
            Get In Touch
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-mocha mt-4 mb-6">Visit Veloura</h1>
          <p className="text-mocha/70 leading-relaxed mb-8">
            Have a question or want to plan a bridal package? Reach out — we'd love to help you
            find the perfect ritual.
          </p>
          <dl className="space-y-5">
            <div>
              <dt className="text-xs tracking-widest uppercase text-caramel mb-1">Address</dt>
              <dd className="text-mocha">Park Street, Kolkata, West Bengal, India</dd>
            </div>
            <div>
              <dt className="text-xs tracking-widest uppercase text-caramel mb-1">Phone</dt>
              <dd className="text-mocha">+91 90000 00000</dd>
            </div>
            <div>
              <dt className="text-xs tracking-widest uppercase text-caramel mb-1">Email</dt>
              <dd className="text-mocha">hello@lumieresalon.in</dd>
            </div>
            <div>
              <dt className="text-xs tracking-widest uppercase text-caramel mb-1">Hours</dt>
              <dd className="text-mocha">Mon–Sat: 10 AM–8 PM · Sun: 11 AM–6 PM</dd>
            </div>
          </dl>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl shadow-soft p-8 space-y-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label className="block text-sm font-medium text-mocha mb-2">Name</label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-mocha/15 bg-white/70 px-4 py-3 text-mocha focus:outline-none focus:ring-2 focus:ring-champagne"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mocha mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-mocha/15 bg-white/70 px-4 py-3 text-mocha focus:outline-none focus:ring-2 focus:ring-champagne"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mocha mb-2">Message</label>
            <textarea
              rows={4}
              required
              className="w-full rounded-xl border border-mocha/15 bg-white/70 px-4 py-3 text-mocha focus:outline-none focus:ring-2 focus:ring-champagne resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-mocha text-ivory font-semibold text-sm tracking-wide hover:bg-caramel transition-all duration-300 shadow-soft hover:shadow-glow"
          >
            Send Message
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default ContactPage;
