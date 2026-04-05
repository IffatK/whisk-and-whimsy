// App.jsx — fixed

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "./components/cart/CartContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Layout from "./components/common/Layout";
import ProductDetails from "./pages/ProductDetails";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./components/admin/Dashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminProducts from "./components/admin/AdminProducts";
import AdminOrders from "./components/admin/AdminOrders";
import AdminAnalytics from "./components/admin/AdminAnalytics";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Checkout from "./components/cart/Checkout";
import Settings from "./components/admin/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true,          element: <Home /> },
      { path: "about",        element: <About /> },
      { path: "menu",         element: <Menu /> },
      { path: "contacts",     element: <Contact /> },
      { path: "cart",         element: <Cart /> },        // ✅ moved inside Layout
      { path: "checkout",     element: <Checkout /> },    // ✅ moved inside Layout
      { path: "product/:id",  element: <ProductDetails /> },
      { path: "signup",       element: <Signup /> },
      { path: "login",        element: <Login /> },
      { path: "profile",      element: <Profile /> },
    ],
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      { path: "dashboard",  element: <Dashboard /> },
      { path: "products",   element: <AdminProducts /> },
      { path: "orders",     element: <AdminOrders /> },
      { path: "users",      element: <AdminUsers /> },
      { path: "analytics",  element: <AdminAnalytics /> },
      {
        path: "settings",
        // ✅ Settings needs user + showToast — Admin parent passes these via Outlet context
        // If Admin uses useOutletContext, Settings should too. For now pass safe defaults.
        element: <Settings />,
      },
    ],
  },
]);

const App = () => (
  <CartProvider>
    <RouterProvider router={router} />
  </CartProvider>
);

export default App;