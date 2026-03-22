import { createContext, useContext, useState, useEffect } from "react";
import cartService from "../services/cartService.js";

// Create the "clipboard" (context)
const CartContext = createContext();

// Exchange rate for display
const USD_TO_PHP = 58;

// This is the "provider" - it wraps your app and gives access to the cart
export const CartProvider = ({ children }) => {
  // "cartItems" is our memory box that stores the shopping cart
  const [cartItems, setCartItems] = useState([]);
  
  // Track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Track if we've loaded initial data
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if user is logged in
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  // Load cart - from MongoDB if logged in, otherwise from localStorage
  useEffect(() => {
    const loadCart = async () => {
      const loggedIn = checkLoginStatus();
      setIsLoggedIn(loggedIn);
      
      try {
        if (loggedIn) {
          // Load from MongoDB
          const mongoCart = await cartService.getCart();
          setCartItems(mongoCart || []);
        } else {
          // Load from localStorage
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        // Fall back to localStorage on error
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
      
      setIsInitialized(true);
    };

    loadCart();
    
    // Check login status periodically (in case user logs in/out)
    const interval = setInterval(() => {
      const loggedIn = checkLoginStatus();
      if (loggedIn !== isLoggedIn) {
        loadCart(); // Reload cart when login status changes
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Save cart - to MongoDB if logged in, otherwise to localStorage
  useEffect(() => {
    // Don't save before we've loaded initial data
    if (!isInitialized) return;
    
    const saveCart = async () => {
      try {
        if (isLoggedIn) {
          // Save to MongoDB
          await cartService.updateCart(cartItems);
        } else {
          // Save to localStorage
          localStorage.setItem("cart", JSON.stringify(cartItems));
        }
      } catch (error) {
        console.error("Error saving cart:", error);
        // Fall back to localStorage on error
        localStorage.setItem("cart", JSON.stringify(cartItems));
      }
    };

    saveCart();
  }, [cartItems, isLoggedIn, isInitialized]);

  // Add item to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItem = prevItems.find((item) => item._id === product._id);
      
      if (existingItem) {
        // If exists, increase quantity
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If new, add with quantity of 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total price
  const getTotal = () => {
    const totalUSD = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return (totalUSD * USD_TO_PHP).toFixed(2);
  };

  // Get number of items in cart
  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // This is what we share with the whole app
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// This is how components access the cart
export const useCart = () => {
  return useContext(CartContext);
};
