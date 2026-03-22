const API_URL = "/api/product";

export const inventoryService = {
  // This function fetches ALL products from the database
  async getAll() {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch products.");
    }
    
    return data;
  },

  async create(productData) {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Product listing failed.");
    }

    return data;
  },

  async update(id, productData) {
    const response = await fetch(`${API_URL}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Product update failed.");
    }

    return data;
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/delete/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete product.");
    }

    return data;
  },
};

export default inventoryService;
