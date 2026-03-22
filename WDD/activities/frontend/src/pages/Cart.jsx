import { useState } from "react";
import { useCart } from "../contexts/CartContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import orderService from "../services/orderService.js";
import "./Cart.css";

const Cart = () => {
  // Get all cart functions from our context
  const { cartItems, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  
  // Get user from auth context
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for checkout form
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  // Handle "Place Order" button click
  const handlePlaceOrder = () => {
    // Check if user is logged in
    if (!user) {
      alert("Please log in to place an order!");
      navigate("/login");
      return;
    }
    
    // Show checkout form
    setShowCheckout(true);
  };

  // Handle shipping address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle order submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    setIsPlacingOrder(true);
    
    try {
      // Prepare order data
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          productId: item._id,
        })),
        shippingAddress,
        totalPrice: cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
      
      // Send to backend
      await orderService.createOrder(orderData);
      
      // Clear cart and show success
      clearCart();
      setOrderSuccess(true);
      setShowCheckout(false);
      setShippingAddress({
        fullName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
      });
      
      alert("Order placed successfully!");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // If cart is empty, show message
  if (cartItems.length === 0) {
    return (
      <div>
        <Header />
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2>Your cart is empty</h2>
          <p>Go add some dice to your cart!</p>
          <Button onClick={() => navigate("/products")}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-container">
        <h1>Your Shopping Cart</h1>
        
        <div className="cart-layout">
          {/* Cart Items List */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-description">{item.description}</p>
                  <p className="cart-item-price">₱{(item.price * 58).toFixed(2)}</p>
                </div>
                
                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <div className="cart-item-subtotal">
                  <p>Subtotal</p>
                  <p className="subtotal-value">
                    ₱{(item.price * 58 * item.quantity).toFixed(2)}
                  </p>
                </div>
                
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <Card title="Order Summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₱{getTotal()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Total:</span>
                <span>₱{getTotal()}</span>
              </div>
              <Button 
                style={{ width: "100%", marginTop: "20px" }}
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
              <Button
                style={{ width: "100%", marginTop: "10px", backgroundColor: "#dc3545" }}
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </Card>
          </div>
        </div>

        {/* Checkout Form Modal */}
        {showCheckout && (
          <div className="checkout-modal">
            <div className="checkout-form">
              <h2>Shipping Information</h2>
              <form onSubmit={handleSubmitOrder}>
                <div className="form-group">
                  <label>Full Name:</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City:</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code:</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country:</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="checkout-buttons">
                  <Button type="submit" disabled={isPlacingOrder}>
                    {isPlacingOrder ? "Placing Order..." : "Confirm Order"}
                  </Button>
                  <Button
                    type="button"
                    style={{ backgroundColor: "#6c757d" }}
                    onClick={() => setShowCheckout(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
