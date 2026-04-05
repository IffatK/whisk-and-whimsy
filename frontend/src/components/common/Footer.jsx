import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import "../../styles/footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <img src="../src/images/logo.png" alt="" className="logofooter" />
        <p className="footer-tagline">Serving joy, one bite at a time 🍰</p>

        <div className="social-icons">
          <a href="#" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="#" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="#" aria-label="Twitter">
            <FaTwitter />
          </a>
        </div>

        <p className="copyright">
          &copy; {new Date().getFullYear()} Whisk & Whimsy. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
