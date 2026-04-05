import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

import "../styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contactbanner">
        <div className="contact-banner">
          <h1>
            We'd Love to <span className="highlight">Hear From You!</span>
          </h1>
          <p>Whether it’s a query, a compliment, or just a sweet hello 🍩</p>
        </div>
      </div>
      <div className="contact-content">
        <form className="contact-form">
          <h2>Send us a message 🍰</h2>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Email Address" required />
          <textarea placeholder="Your Message..." rows="5" required></textarea>
          <button type="submit">Send</button>
        </form>

        <div className="contact-details">
          <h2>Contact Info ☎️</h2>
          <div className="info-box">
            <FaMapMarkerAlt className="icon" />
            <p>Mumbai, India</p>
          </div>
          <div className="info-box">
            <FaPhone className="icon" />
            <p>+91 98765 43210</p>
          </div>
          <div className="info-box">
            <FaEnvelope className="icon" />
            <p>hello@whisknwhimsy.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
