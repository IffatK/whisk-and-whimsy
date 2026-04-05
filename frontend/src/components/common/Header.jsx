import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SideNav from "./SideNav";

const Header = () => {
  const [showSideNav, setShowSideNav] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
  };

  const closeSideNav = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowSideNav(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navlinks = [
    { name: "Home", link: "/" },
    { name: "Menu", link: "/menu" },
    { name: "About Us", link: "/about" },
    { name: "Contact us", link: "/contacts" },
  ];

  return (
    <div id="container-1">
      <header className="headercontainer">
        <NavLink to="/">
          <img
            src="../src/images/logo.png"
            alt="Whisk & Whimsy Logo"
            className="logo-image"
          />
        </NavLink>

        <nav>
          <ul>
            {navlinks.map((item) => (
              <li key={item.name}>
                <NavLink to={item.link}>{item.name}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="right-section">
          {token ? (
            <>
              <button className="button" onClick={() => navigate("/profile")}>
                Profile 👤
              </button>
              <button className="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="button">
              <NavLink to="/signup" className="signupbutton">
                Sign Up
              </NavLink>
            </button>
          )}

          <img
            src="../src/images/hamburger.svg"
            alt="Menu"
            className="hamburgur"
            onClick={toggleSideNav}
          />
        </div>
      </header>

      {showSideNav && (
        <div className="overlay" onClick={closeSideNav}>
          <SideNav />
        </div>
      )}
    </div>
  );
};

export default Header;