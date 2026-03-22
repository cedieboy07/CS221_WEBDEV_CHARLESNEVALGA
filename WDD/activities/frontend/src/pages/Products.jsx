import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { inventoryService } from "../services/inventoryService.js";
import { useCart } from "../contexts/CartContext.jsx";
import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
import "./Products.css";

// Exchange rate: 1 USD = 58 PHP
const USD_TO_PHP = 58;

const Products = () => {
  // "products" is like a "memory box" that stores the list of dice
  const [products, setProducts] = useState([]);
  
  // "loading" tracks if we're still waiting for data
  const [loading, setLoading] = useState(true);
  
  // "error" stores any error messages
  const [error, setError] = useState(null);
  
  // "searchTerm" stores what the user types
  const [searchTerm, setSearchTerm] = useState("");
  
  // For navigation
  const navigate = useNavigate();

  // Get the addToCart function from our CartContext
  const { addToCart } = useCart();

  // Function to convert USD to PHP
  const convertToPHP = (usdPrice) => {
    return (usdPrice * USD_TO_PHP).toFixed(2);
  };

  // Handle adding item to cart
  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // useEffect runs when the page loads (like "on page load" event)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Call the API to get all products
        const data = await inventoryService.getAll();
        
        // Save the products to our "memory box"
        setProducts(data);
        
        // Done loading!
        setLoading(false);
      } catch (err) {
        // Something went wrong, save the error
        setError(err.message);
        setLoading(false);
      }
    };

    // Actually run the fetch
    fetchProducts();
  }, []); // Empty [] means "run only once when page loads"

  // Show loading message while waiting
  if (loading) {
    return <p>Loading dice...</p>;
  }

  // Show error message if something went wrong
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="products-page">
      <Header />
      <h1 className="page-title">Messy Dice Bag</h1>
      
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search dice by name or description..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <Button onClick={() => setSearchTerm("")}>
          Clear
        </Button>
      </div>
      
      {/* Show number of results */}
      <p className="search-results">
        {filteredProducts.length === 0 
          ? "No dice found matching your search." 
          : `Showing ${filteredProducts.length} of ${products.length} dice`}
      </p>
      
      {/* If no products exist, show a message */}
      {filteredProducts.length === 0 ? (
        <p style={{ padding: "20px", textAlign: "center" }}>
          Try a different search term!
        </p>
      ) : (
        // Grid layout with equal-sized cards
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                onClick={() => navigate(`/products/${product._id}`)}
                style={{ cursor: "pointer" }}
              />
              <h3 onClick={() => navigate(`/products/${product._id}`)} style={{ cursor: "pointer" }}>
                {product.name}
              </h3>
              <p className="description">{product.description}</p>
              <p className="price">₱{convertToPHP(product.price)}</p>
              <p className="stock">Stock: {product.countInStock} left</p>
              <div className="product-buttons">
                <Button onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
                <Link to={`/products/${product._id}`}>
                  <Button className="view-details-btn">View Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
