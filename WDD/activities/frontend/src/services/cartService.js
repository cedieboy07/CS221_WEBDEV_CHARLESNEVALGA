const API_URL = "/api/cart";

export const cartService = {
  // Get cart from MongoDB
  async getCart() {
    const token = localStorage.getItem("token");
    
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get cart");
    }
    
    return data;
  },
  
  // Update entire cart in MongoDB
  async updateCart(cart) {
    const token = localStorage.getItem("token");
    
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cart }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to update cart");
    }
    
    return data;
  },
  
  // Add item to cart in MongoDB
  async addToCart(product) {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to add item to cart");
    }
    
    return data;
  },
  
  // Remove item from cart in MongoDB
  async removeFromCart(productId) {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to remove item from cart");
    }
    
    return data;
  },
  
  // Clear cart in MongoDB
  async clearCart() {
    const token = localStorage.getItem("token");
    
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to clear cart");
    }
    
    return data;
  },
};

export default cartService;
