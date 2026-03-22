import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>🎲 Messy Dice</h3>
          <p>Your source for premium tabletop gaming dice</p>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/login">Login</Link>
          </div>
          <div className="link-group">
            <h4>Categories</h4>
            <p>Polyhedral Sets</p>
            <p>Metal Dice</p>
            <p>Collector Dice</p>
          </div>
          <div className="link-group">
            <h4>Contact</h4>
            <p>📧 diceshop@example.com</p>
            <p>📱 0912-345-6789</p>
            <p>📍 Manila, Philippines</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Messy Dice. All rights reserved.</p>
          <p>Made with 🎲 for tabletop gamers</p>
        </div>
      </div>
    </footer>
  );
}
