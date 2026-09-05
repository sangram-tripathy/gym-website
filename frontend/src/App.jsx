import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WorkoutSessions from "./components/WorkoutSessions";
import Gallery from "./components/Gallery";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import BMICalculator from "./components/BMICalculator";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WorkoutTracker from "./pages/WorkoutTracker";
import AdminDashboard from "./pages/AdminDashboard";
import AIChatbot from "./components/AIChatbot";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" />;
  return children;
};

const Home = () => (
  <>
    <Hero />
    <WorkoutSessions />
    <Gallery />
    <Pricing />
    <Contact />
    <BMICalculator />
    <Footer />
  </>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/workout" element={<ProtectedRoute><WorkoutTracker /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        </Routes>
        <ToastContainer theme="dark" position="top-center" />
        <AIChatbot />
      </Router>
    </AuthProvider>
  );
};

export default App;
