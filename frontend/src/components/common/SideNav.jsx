import React from "react";
import { NavLink } from "react-router-dom";
const navlinks = [
  { name: "Home", link: "/" },
  { name: "Menu", link: "/menu" },
  { name: "About Us", link: "/about" },
  
  { name: "Contact us", link: "/contacts" },
];

const SideNav = () => {
  return (
    <div className="side-nav">
      <img src="../src/images/bread-sidenav.png" alt="" className="bread" />
      <nav>
        <ul>
          {navlinks.map((elem, index) => (
            <li key={index}>
              <NavLink to={elem.link}>{elem.name}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SideNav;
