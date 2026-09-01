import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import "./index.css";
import { CheckoutProvider } from "./context/checkoutContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
  <AuthProvider> {/* Auth should wrap everything that needs auth */}
    <CartProvider> {/* Cart needs auth */}
      <WishlistProvider> {/* Wishlist needs auth */}
        <CheckoutProvider> {/* Checkout needs auth */}
          {/* <OtherProviders> */}
            <App />
          {/* </OtherProviders> */}
        </CheckoutProvider>
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
</BrowserRouter>
  </StrictMode>
);
