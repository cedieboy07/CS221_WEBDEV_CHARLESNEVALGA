import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import "../styles/Header.css";
import Button from "../components/Button";

export default function Header() {
  // Get the cart item count
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  
  // Get user and logout from auth context
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Get user role from localStorage
  const userData = user ? JSON.parse(localStorage.getItem("user") || "{}") : {};
  const isAdmin = userData.role === "admin";
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="landing-header">
        <div className="header-container">
          <div className="logo">
            <Link to="/" style={{ textDecoration: "none" }}>
              <h2>🎲 Messy Dice</h2>
            </Link>
          </div>
          <nav className="navigation">
            <Link to="/">Home</Link>
            <Link to="/products">Dice Bag</Link>
            {user ? (
              <>
                <Link to="/orders">My Orders</Link>
                {isAdmin && <Link to="/admin">Admin</Link>}
                <button 
                  onClick={handleLogout}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#fff8f0", fontSize: "16px" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">Login / Register</Link>
            )}
          </nav>
          <div className="auth-section">
            <Link to="/cart">
              <Button variant="primary" type="button">
                Cart {itemCount > 0 && `(${itemCount})`}
              </Button>
            </Link>
          </div>
        </div>
      </header>
    </>
  ); 
}
