import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

const AccountPage = () => {
  const { user } = useAuth();

  return (
    <div className="pt-32 pb-24 px-6 lg:px-10 bg-ivory min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto glass rounded-3xl shadow-soft p-10"
      >
        <div className="flex items-center gap-4 mb-8">
          <span className="h-16 w-16 rounded-full bg-champagne text-ivory flex items-center justify-center text-2xl font-display">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-3xl text-mocha">{user?.name}</h1>
            <p className="text-sm text-mocha/60 capitalize">{user?.role} account</p>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <dt className="text-xs tracking-widest uppercase text-champagne mb-1">Email</dt>
            <dd className="text-mocha">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-widest uppercase text-champagne mb-1">Phone</dt>
            <dd className="text-mocha">{user?.phone || "Not added"}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-widest uppercase text-champagne mb-1">Member Since</dt>
            <dd className="text-mocha">
              {user?.createdAt &&
                new Date(user.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
            </dd>
          </div>
        </dl>
      </motion.div>
    </div>
  );
};

export default AccountPage;
