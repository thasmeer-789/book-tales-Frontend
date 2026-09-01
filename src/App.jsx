import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./Components/Layout";

/* USER PAGES */
import Home from "./Pages/Home";
import Category from "./Pages/Category";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import VerifyOtp from "./Pages/VerifyOtp";
import ForgotPassword from "./Pages/ForgotPassword";
import Profile from "./Pages/Profile";
import Cart from "./Pages/Cart";
import Wishlist from "./Pages/Wishlist";
import ProductDetails from "./Pages/productDetails";
import Checkout from "./Pages/checkout";
import Payment from "./Pages/payment";
import Orders from "./Pages/orders";
import OrderDetails from "./Pages/orderDetails";
import OrderSuccess from "./Pages/orderSuccess";

/* ADMIN */
import AdminRoute from "./admin/AdminRoute";
import AdminLayout from "./admin/AdminLayout";

import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminUsers from "./admin/pages/AdminUsers";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            border: "3px solid black",
            fontWeight: "bold",
          },
        }}
      />

      <Routes>
        {/* USER SIDE */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
        </Route>

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ADMIN SIDE */}
        <Route path="/admin" element={<AdminRoute />}>
  <Route element={<AdminLayout />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="products" element={<AdminProducts />} />
    <Route path="orders" element={<AdminOrders />} />
    <Route path="users" element={<AdminUsers />} />
  </Route>

        </Route>
      </Routes>
    </>
  );
}

export default App;
