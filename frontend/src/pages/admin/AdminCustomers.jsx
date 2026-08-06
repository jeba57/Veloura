import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .get("/admin/customers")
      .then((res) => {
        setCustomers(res.data.customers || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl text-mocha mb-6">Customers</h1>

      {status === "loading" && <p className="text-mocha/60">Loading customers...</p>}
      {status === "error" && <p className="text-red-600">Failed to load customers.</p>}
      {status === "success" && customers.length === 0 && (
        <p className="text-mocha/60">No customers yet.</p>
      )}

      {status === "success" && customers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sand/60 text-mocha/70 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Email</th>
                <th className="text-left px-6 py-3">Phone</th>
                <th className="text-left px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-mocha/5">
                  <td className="px-6 py-3 text-mocha">{c.name}</td>
                  <td className="px-6 py-3 text-mocha/70">{c.email}</td>
                  <td className="px-6 py-3 text-mocha/70">{c.phone || "—"}</td>
                  <td className="px-6 py-3 text-mocha/70">
                    {new Date(c.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
