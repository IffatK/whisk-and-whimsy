import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../services/api";

const ProductModal = ({ product, categories, onSave, onClose }) => {
  const [form, setForm] = useState(
    product || {
      name: "",
      price: "",
      category: categories[0]?.name ?? "",
      stock_quantity: "",
      description: "",
      image: ""
    }
  );

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">
          {product ? "✏️ Edit Product" : "✨ Add New Product"}
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label className="form-label">Product Name</label>
          <input
            className="form-input"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="e.g. Tiramisu Delight"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Price (₹)</label>
            <input
              className="form-input"
              type="number"
              value={form.price}
              onChange={e => set("price", e.target.value)}
              placeholder="320"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Stock Quantity</label>
            <input
              className="form-input"
              type="number"
              value={form.stock_quantity}
              onChange={e => set("stock_quantity", e.target.value)}
              placeholder="12"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          {/* ✅ value = category name, not category_id */}
          <select
            className="form-input"
            value={form.category}
            onChange={e => set("category", e.target.value)}
            style={{ cursor: "pointer" }}
          >
            {categories.map(c => (
              <option key={c.category_id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            rows={3}
            value={form.description || ""}
            onChange={e => set("description", e.target.value)}
            placeholder="Describe this delicious item..."
            style={{ resize: "vertical" }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input
            className="form-input"
            value={form.image || ""}
            onChange={e => set("image", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="form-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave(form)}>
            {product ? "💾 Save Changes" : "✨ Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminProducts = () => {
const { products, setProducts, fetchProducts, showToast } = useOutletContext();
  
  const [categories, setCategories] = useState([]);
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [view, setView]           = useState("grid");
  const [modal, setModal]         = useState(null);

  useEffect(() => {
  fetchCategories();
}, []);

  

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (form) => {
  try {
    if (modal === "add") {
      console.log("SENDING TO BACKEND:", form); // 👈 add this
      const res = await api.post("/products", {
        name:           form.name,
        category:       form.category,
        price:          form.price,
        stock_quantity: form.stock_quantity,
        description:    form.description,
        image:          form.image,
      });
      console.log("BACKEND RESPONSE:", res.data); // 👈 and this
      showToast("✨ Product added successfully!");
      fetchProducts();
setModal(null);
    }
    // ...
  } catch (err) {
    console.log("ERROR:", err.response?.data); // 👈 and this
    showToast("❌ Failed to save product");
  }
};

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      showToast("🗑️ Product deleted.");
      fetchProducts();
    } catch {
      showToast("❌ Failed to delete product");
    }
  };

  // ✅ filter by category name (p.category is the name string from backend)
  const filtered = products.filter(p =>
    (catFilter === "All" || p.category === catFilter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-products-background">
      {modal && (
        <ProductModal
          product={modal === "add" ? null : modal}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      <div className="page-header">
        <div>
          <div className="page-header-title">🎂 Products</div>
          <div className="page-header-sub">{products.length} items in menu</div>
        </div>
        <button className="btn-primary" onClick={() => setModal("add")}>+ Add Product</button>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <input
            className="search-input"
            placeholder="🔍 Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {/* ✅ filter select uses category name as value */}
          <select
            className="filter-select"
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.category_id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <div className="view-toggle">
            <button className={`view-btn${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")}>⊞</button>
            <button className={`view-btn${view === "list" ? " active" : ""}`} onClick={() => setView("list")}>☰</button>
          </div>
        </div>

        {view === "grid" ? (
          <div className="products-grid">
            {filtered.map(p => (
              <div key={p.product_id} className="product-card">
                <img
                  src={p.image || p.image_url}
                  alt={p.name}
                  className="product-card-img"
                  onError={e => e.target.src = "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=200&q=80"}
                />
                <div className="product-card-body">
                  <div className="product-card-name">{p.name}</div>
                  <div className="product-card-cat">📁 {p.category} · 📦 {p.stock_quantity} in stock</div>
                  <div className="product-card-footer">
                    <div className="product-price">₹{p.price}</div>
                  </div>
                  <div className="product-actions">
                    <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setModal(p)}>✏️ Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(p.product_id)}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="empty-state" style={{ gridColumn: "1/-1" }}>
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-text">No products found</div>
              </div>
            )}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.product_id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={p.image || p.image_url}
                        alt={p.name}
                        style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover" }}
                        onError={e => e.target.src = "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=200&q=80"}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.description?.slice(0, 40)}...</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="role-pill role-customer">{p.category}</span></td>
                  <td><strong>₹{p.price}</strong></td>
                  <td>{p.stock_quantity}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn-secondary" onClick={() => setModal(p)}>✏️ Edit</button>
                      <button className="btn-danger" onClick={() => handleDelete(p.product_id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;