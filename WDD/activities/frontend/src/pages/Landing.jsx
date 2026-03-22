import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { inventoryService } from "../services/inventoryService.js";
import "./Landing.css";

// Exchange rate
const USD_TO_PHP = 58;

export default function Landing() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Fetch products to show featured items
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await inventoryService.getAll();
        // Show first 3 products as featured
        setFeaturedProducts(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Convert price to PHP
  const convertToPHP = (price) => {
    return (price * USD_TO_PHP).toFixed(2);
  };

  return (
    <div className="landing-page">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🎲 Messy Dice</h1>
          <p className="hero-subtitle">
            Care to indulge more in your nerdiness? Get messy with Messy Dice.
          </p>
          <p className="hero-description">
            Your one-stop shop for premium tabletop gaming dice. Handcrafted sets for D&D, Pathfinder, and all your favorite RPG adventures.
          </p>
          <Link to="/products">
            <Button className="hero-button">Browse Collection</Button>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <h2 className="section-title">[FEATURED PRODUCTS TITLE]</h2>
        <p className="section-subtitle">[FEATURED PRODUCTS SUBTITLE]</p>
        
        <div className="featured-grid">
          {featuredProducts.map((product) => (
            <div key={product._id} className="featured-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="featured-price">₱{convertToPHP(product.price)}</p>
              <p className="featured-description">{product.description}</p>
              <Link to="/products">
                <Button>View Details</Button>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="section-cta">
          <Link to="/products">
            <Button>View All Products</Button>
          </Link>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="announcements-section">
        <h2 className="section-title">[ANNOUNCEMENTS TITLE]</h2>
        
        <div className="announcements-grid">
          <div className="announcement-card">
            <span className="announcement-date">[DATE 1]</span>
            <h3>[ANNOUNCEMENT TITLE 1]</h3>
            <p>[ANNOUNCEMENT DESCRIPTION 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.]</p>
          </div>
          
          <div className="announcement-card">
            <span className="announcement-date">[DATE 2]</span>
            <h3>[ANNOUNCEMENT TITLE 2]</h3>
            <p>[ANNOUNCEMENT DESCRIPTION 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.]</p>
          </div>
          
          <div className="announcement-card">
            <span className="announcement-date">[DATE 3]</span>
            <h3>[ANNOUNCEMENT TITLE 3]</h3>
            <p>[ANNOUNCEMENT DESCRIPTION 3 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.]</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-section">
        <h2 className="section-title">[WHY CHOOSE US TITLE]</h2>
        
        <div className="why-grid">
          <div className="why-card">
            <span className="why-icon">✨</span>
            <h3>[BENEFIT 1 TITLE]</h3>
            <p>[BENEFIT 1 DESCRIPTION - Lorem ipsum dolor sit amet.]</p>
          </div>
          
          <div className="why-card">
            <span className="why-icon">🚚</span>
            <h3>[BENEFIT 2 TITLE]</h3>
            <p>[BENEFIT 2 DESCRIPTION - Lorem ipsum dolor sit amet.]</p>
          </div>
          
          <div className="why-card">
            <span className="why-icon">💰</span>
            <h3>[BENEFIT 3 TITLE]</h3>
            <p>[BENEFIT 3 DESCRIPTION - Lorem ipsum dolor sit amet.]</p>
          </div>
          
          <div className="why-card">
            <span className="why-icon">🎮</span>
            <h3>[BENEFIT 4 TITLE]</h3>
            <p>[BENEFIT 4 DESCRIPTION - Lorem ipsum dolor sit amet.]</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>[CTA HEADING]</h2>
        <p>[CTA SUBTEXT - Lorem ipsum dolor sit amet, consectetur adipiscing elit.]</p>
        <Link to="/products">
          <Button className="cta-button">[CTA BUTTON TEXT]</Button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
