import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import { NavLink } from "react-router-dom";

const BASE_URL = "http://localhost:5000/api";

const FeaturedDessert = () => {
  const [products, setProducts] = useState([]);

  // ✅ FIXED API CALL
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products`);
        setProducts(res.data.data); // ✅ FIXED
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Safe slice
  const featuredProducts = products.slice(0, 4);

  return (
    <div id="container-2">
      <h1 className="title">Baked to Perfection, Just for You</h1>

      <div className="card-container" id="productTemplate">
        {featuredProducts.map((elem) => (
          <Card
            key={elem.product_id}
            id={elem.product_id}
            img={elem.image || "/images/fallback.svg"}
            sweetname={elem.name}
            summary={elem.description}
            price={elem.price}
          />
        ))}
      </div>

      <NavLink className="button navlink-btn" to="/menu">
        View All
      </NavLink>
    </div>
  );
};

export default FeaturedDessert;