import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const AdminLayout = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: "/admin", label: "Bookings", end: true },
    { to: "/admin/services", label: "Services" },
    { to: "/admin/customers", label: "Customers" },
    ...(user?.role === "super_admin"
      ? [{ to: "/admin/admins", label: "Admin Accounts" }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-sand/30 flex flex-col md:flex-row">
      <aside className="md:w-64 bg-mocha text-ivory flex flex-col shrink-0">
        <div className="p-6 border-b border-ivory/10">
          <span className="font-display text-2xl">Veloura</span>
          <span className="block text-[10px] tracking-[0.3em] uppercase text-champagne mt-1">
            Admin Panel
          </span>
        </div>
        <nav className="flex-1 p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? "bg-champagne text-mocha" : "text-ivory/70 hover:bg-ivory/10"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-ivory/10">
          <p className="text-xs text-ivory/50 mb-2 px-2">
            Signed in as <span className="text-ivory">{user?.name}</span> ({user?.role.replace("_", " ")})
          </p>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-caramel hover:bg-ivory/10 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
