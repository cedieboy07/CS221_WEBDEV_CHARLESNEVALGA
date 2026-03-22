import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import orderHistoryService from "../services/orderHistoryService.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";
import "./OrderHistory.css";

// Exchange rate
const USD_TO_PHP = 58;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Convert price to PHP
  const convertToPHP = (price) => {
    return (price * USD_TO_PHP).toFixed(2);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch orders when page loads
  useEffect(() => {
    const fetchOrders = async () => {
      // Check if user is logged in
      if (!user) {
        setError("Please log in to view your orders");
        setLoading(false);
        return;
      }

      try {
        const data = await orderHistoryService.getOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Loading state
  if (loading) {
    return (
      <div className="order-history-page">
        <Header />
        <div className="loading-container">
          <p>Loading your orders...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state (not logged in)
  if (!user) {
    return (
      <div className="order-history-page">
        <Header />
        <div className="error-container">
          <h2>Please Log In</h2>
          <p>You need to be logged in to view your order history.</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="order-history-page">
        <Header />
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
        </div>
        <Footer />
      </div>
    );
  }

  // No orders yet
  if (orders.length === 0) {
    return (
      <div className="order-history-page">
        <Header />
        <div className="empty-container">
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet. Start shopping!</p>
          <Button onClick={() => navigate("/products")}>Browse Products</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <Header />
      
      <div className="order-history-container">
        <h1 className="page-title">📦 Your Order History</h1>
        
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                <div className="order-status">
                  {order.isPaid ? (
                    <span className="status-paid">✓ Paid</span>
                  ) : (
                    <span className="status-pending">⏳ Pending</span>
                  )}
                </div>
              </div>
              
              <div className="order-items">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                    </div>
                    <span className="item-price">₱{convertToPHP(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="order-footer">
                <div className="shipping-info">
                  <p><strong>Ship to:</strong> {order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}</p>
                </div>
                <div className="order-total">
                  <span>Total:</span>
                  <span className="total-price">₱{convertToPHP(order.totalPrice)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="continue-shopping">
          <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderHistory;
