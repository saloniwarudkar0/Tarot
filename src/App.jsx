
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Tarot from "./pages/Tarot";
import Learn from "./pages/Learn";
import Zodiac from "./pages/Zodiac";
import Journal from "./pages/Journal";
import JournalDetail from "./pages/JournalDetail";
import About from "./pages/About";
import Booking from "./pages/Booking";

import Admin from "./pages/Admin";
import AdminJournal from "./pages/AdminJournal";
import AdminTarot from "./pages/AdminTarot";
import AdminHoroscope from "./pages/AdminHoroscope";
import AdminAbout from "./pages/AdminAbout";
import AdminSettings from "./pages/AdminSettings";
import AdminLogin from "./pages/AdminLogin";

// Public Website Layout
function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tarot" element={<Tarot />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/zodiac" element={<Zodiac />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:slug" element={<JournalDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
    </>
  );
}

// Protect Admin Routes
function RequireAdmin() {
  const token = localStorage.getItem("divineCaratAdminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

// Admin Layout
function AdminLayout() {
  return (
    <Routes>
      {/* Login Page */}
      <Route path="login" element={<AdminLogin />} />

      {/* Protected Admin Pages */}
      <Route element={<RequireAdmin />}>
        <Route index element={<Admin />} />
        <Route path="journal" element={<AdminJournal />} />
        <Route path="tarot" element={<AdminTarot />} />
        <Route path="horoscope" element={<AdminHoroscope />} />
        <Route path="about" element={<AdminAbout />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Invalid Admin Route */}
      <Route
        path="*"
        element={<Navigate to="/admin" replace />}
      />
    </Routes>
  );
}

// Main App
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
