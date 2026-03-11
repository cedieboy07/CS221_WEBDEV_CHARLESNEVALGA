import React from "react";
import "../styles/Header.css";
import Button from "../components/Button";

export default function Header() {
  return (
    <>
      <header className="landing-header">
        <div className="header-container">
          <div className="logo">
            <h2>My App</h2>
          </div>
          <nav className="navigation">
            <a href="/">Home</a>
            <a href="/login">Login</a>
            <a href="/inventory">Inventory</a>
          </nav>
          <div className="auth-section">
            <Button variant="primary" type="button">
              Login
            </Button>
          </div>
        </div>
      </header>
    </>
  ); 
}
