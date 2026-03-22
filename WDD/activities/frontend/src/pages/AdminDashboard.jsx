import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { inventoryService } from "../services/inventoryService.js";
import orderHistoryService from "../services/orderHistoryService.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";
import "./AdminDashboard.css";

// Exchange rate
const USD_TO_PHP = 58;

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // State for products
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // State for orders
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  
  // State for form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    countInStock: "",
  });

  // Check if user is admin - REDIRECT IF NOT ADMIN
  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;
    
    if (!user) {
      navigate("/login");
    } else {
      // Get fresh user data from localStorage to check role
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (userData.role !== "admin") {
        // Not an admin, redirect to products
        navigate("/products");
      } else {
        // User is admin, fetch data
        fetchProducts();
        fetchOrders();
      }
    }
  }, [user, loading, navigate]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const data = await inventoryService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch orders (all orders for admin)
  const fetchOrders = async () => {
    try {
      const data = await orderHistoryService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle add/edit product
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image,
      countInStock: parseInt(formData.countInStock),
    };

    try {
      if (editingProduct) {
        // Update existing product
        await inventoryService.update(editingProduct._id, productData);
        alert("Product updated successfully!");
      } else {
        // Create new product
        await inventoryService.create(productData);
        alert("Product added successfully!");
      }
      
      // Reset form and refresh
      setFormData({ name: "", description: "", price: "", image: "", countInStock: "" });
      setShowProductForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle edit
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      countInStock: product.countInStock.toString(),
    });
    setShowProductForm(true);
  };

  // Handle delete
  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await inventoryService.delete(productId);
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  // Cancel form
  const handleCancel = () => {
    setFormData({ name: "", description: "", price: "", image: "", countInStock: "" });
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // Toggle orders view
  const toggleOrders = () => {
    if (!showOrders) {
      fetchOrders();
    }
    setShowOrders(!showOrders);
  };

  // Handle delete all orders
  const handleDeleteAllOrders = async () => {
    if (!confirm("Are you sure you want to DELETE ALL orders? This cannot be undone!")) return;
    if (!confirm("WARNING: All orders will be permanently deleted. Continue?")) return;
    
    try {
      await orderHistoryService.deleteAllOrders();
      alert("All orders deleted successfully!");
      setOrders([]); // Clear the orders list
    } catch (error) {
      alert(error.message);
    }
  };

  // Convert price to PHP
  const convertToPHP = (price) => {
    return (price * USD_TO_PHP).toFixed(2);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <Header />
        <div className="admin-container">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="admin-page">
      <Header />
      
      <div className="admin-container">
        <h1 className="page-title">🎲 Admin Dashboard</h1>
        
        {/* Dashboard Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p className="stat-number">{products.length}</p>
          </div>
          <div className="stat-card">
            <button onClick={toggleOrders} className="stat-button">
              View Orders ({orders.length})
            </button>
          </div>
        </div>

        {/* Product Management Section */}
        <section className="admin-section">
          <div className="section-header">
            <h2>Product Management</h2>
            <Button onClick={() => setShowProductForm(!showProductForm)}>
              {showProductForm ? "Cancel" : "+ Add Product"}
            </Button>
          </div>

          {/* Add/Edit Product Form */}
          {showProductForm && (
            <div className="product-form-container">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <form onSubmit={handleSubmitProduct} className="product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      name="countInStock"
                      value={formData.countInStock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-buttons">
                  <Button type="submit">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  <Button type="button" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Products List */}
          <div className="products-list">
            {products.length === 0 ? (
              <p className="empty-message">No products yet. Add your first product!</p>
            ) : (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img src={product.image} alt={product.name} className="product-thumb" />
                      </td>
                      <td>{product.name}</td>
                      <td>₱{convertToPHP(product.price)}</td>
                      <td>{product.countInStock}</td>
                      <td>
                        <Button onClick={() => handleEdit(product)}>Edit</Button>
                        <Button onClick={() => handleDelete(product._id)} className="delete-btn">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Orders Management Section */}
        {showOrders && (
          <section className="admin-section">
            <h2>Order Management</h2>
          
          <div className="orders-list">
            {orders.length === 0 ? (
              <p className="empty-message">No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="order-item">
                  <div className="order-header">
                    <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="order-items">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="order-item-detail">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₱{convertToPHP(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <span className="order-total">
                      Total: ₱{convertToPHP(order.totalPrice)}
                    </span>
                    <span className={`order-status ${order.isPaid ? "paid" : "pending"}`}>
                      {order.isPaid ? "✓ Paid" : "⏳ Pending"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Delete All Orders Button */}
          {orders.length > 0 && (
            <div className="delete-all-orders">
              <Button onClick={handleDeleteAllOrders} className="delete-btn">
                Delete All Orders ({orders.length})
              </Button>
            </div>
          )}
          </section>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
