import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header>
      <Link to="/" style={{ textDecoration: "none" }}>
        <p>INTENSITY FITNESS</p>
      </Link>
      <nav className="nav-links">
        {!user ? (
          <>
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/register" className="nav-btn">Join Now</Link>
          </>
        ) : (
          <>
            {user.role === "admin" && <Link to="/admin">Dashboard</Link>}
            {user.role === "user" && <Link to="/workout">My Workouts</Link>}
            <span className="nav-user">Hi, {user.name.split(" ")[0]}</span>
            <button className="nav-btn nav-logout" onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
