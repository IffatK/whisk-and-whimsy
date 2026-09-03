import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/productinfo.css";

// MUST include /api to match Express backend routes
const BASE_URL = "http://localhost:5000/api";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/products/${id}`)
      .then((res) => {
        // Handles payload wrapped in res.data.data or res.data
        setProduct(res.data.data || res.data);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      });
  }, [id]);

  if (error) {
    return <h2 style={{ textAlign: "center", marginTop: "2rem" }}>{error}</h2>;
  }

  if (!product) {
    return <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</h2>;
  }

  return (
    <div className="productPage">
      <div className="product-card">
        <img
          src={product.image || "/images/fallback.svg"}
          alt={product.name}
          width="200"
        />
        <div className="productinfo">
          <h2>{product.name}</h2>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Price:</strong> ₹{product.price}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Stock:</strong> {product.stock_quantity}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;