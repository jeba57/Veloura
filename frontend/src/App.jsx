import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import ServicesPage from "./pages/Services.jsx";
import BookingPage from "./pages/Booking.jsx";
import ContactPage from "./pages/Contact.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import AccountPage from "./pages/Account.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminBookings from "./pages/admin/AdminBookings.jsx";
import AdminServices from "./pages/admin/AdminServices.jsx";
import AdminCustomers from "./pages/admin/AdminCustomers.jsx";
import AdminAccounts from "./pages/admin/AdminAccounts.jsx";

function App() {
  const location = useLocation();
const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route
      path="/booking"
      element={
        <ProtectedRoute>
          <BookingPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/account"
      element={
        <ProtectedRoute>
          <AccountPage />
        </ProtectedRoute>
      }
    />

    {/* ADMIN ROUTES */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute roles={["admin", "super_admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<AdminBookings />} />
      <Route path="services" element={<AdminServices />} />
      <Route path="customers" element={<AdminCustomers />} />
      <Route
        path="admins"
        element={
          <ProtectedRoute roles={["super_admin"]}>
            <AdminAccounts />
          </ProtectedRoute>
        }
      />
    </Route>
  </Routes>
</main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
