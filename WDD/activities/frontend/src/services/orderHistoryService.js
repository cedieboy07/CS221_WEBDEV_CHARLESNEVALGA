const API_URL = "/api/orders";

export const orderService = {
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
  
  // Get ALL orders (for admin)
  async getAllOrders() {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/all`, {
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
  
  // Delete ALL orders (for admin)
  async deleteAllOrders() {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/all`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete orders");
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
