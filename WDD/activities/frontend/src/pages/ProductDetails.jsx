import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { inventoryService } from "../services/inventoryService.js";
import { useCart } from "../contexts/CartContext.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";
import "./ProductDetails.css";

// Exchange rate
const USD_TO_PHP = 58;

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch product details when page loads
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Get all products and find the one with matching ID
        const products = await inventoryService.getAll();
        const foundProduct = products.find((p) => p._id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Convert price to PHP
  const convertToPHP = (price) => {
    return (price * USD_TO_PHP).toFixed(2);
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= product.countInStock) {
      setQuantity(value);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      // Add the product multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      alert(`${quantity} x ${product.name} added to cart!`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="product-details-page">
        <Header />
        <div className="loading-container">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="product-details-page">
        <Header />
        <div className="error-container">
          <p>Error: {error}</p>
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="product-details-page">
        <Header />
        <div className="error-container">
          <p>Product not found!</p>
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <Header />
      
      <div className="product-details-container">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate("/products")}>
          ← Back to Products
        </button>

        <div className="product-details-content">
          {/* Product Image */}
          <div className="product-image-container">
            <img 
              src={product.image} 
              alt={product.name} 
              className="product-image"
            />
          </div>

          {/* Product Info */}
          <div className="product-info-container">
            <h1 className="product-name">{product.name}</h1>
            
            <p className="product-price">₱{convertToPHP(product.price)}</p>
            
            <p className="product-description">{product.description}</p>
            
            <div className="product-stock">
              {product.countInStock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.countInStock} available)</span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            {product.countInStock > 0 && (
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.countInStock}
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                    disabled={quantity >= product.countInStock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="product-actions">
              <Button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
              >
                {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
              
              <Button 
                className="continue-shopping-btn"
                onClick={() => navigate("/products")}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
