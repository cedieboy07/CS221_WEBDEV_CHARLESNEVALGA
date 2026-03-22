const API_URL = "/api/orders";

export const orderService = {
  // Create a new order
  async createOrder(orderData) {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send the JWT token
      },
      body: JSON.stringify(orderData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to place order");
    }
    
    return data;
  },
  
  // Get all orders for the logged-in user
  async getOrders() {
    const token = localStorage.getItem("token");
    
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch orders");
    }
    
    return data;
  },
  
  // Get a specific order by ID
  async getOrderById(id) {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch order");
    }
    
    return data;
  },
};

export default orderService;
