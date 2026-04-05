import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="user-page-content">
      <Header />

      <div className="user-main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
