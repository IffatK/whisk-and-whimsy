// frontend/src/components/AddressCard.jsx
import { useState } from "react";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

const emptyForm = { address_line: "", city: "", state: "", pincode: "", is_default: false };

// ── Address Form Modal ────────────────────────────────────────────────────────
export function AddressFormModal({ initial = emptyForm, onSave, onClose, loading }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.address_line.trim()) e.address_line = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state) e.state = "Required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (validate()) onSave(form);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>
            {initial === emptyForm ? "Add New Address" : "Edit Address"}
          </h3>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <form onSubmit={submit} style={styles.form}>
          <Field label="Address Line" error={errors.address_line}>
            <input
              style={inputStyle(errors.address_line)}
              placeholder="House/Flat No., Street, Area"
              value={form.address_line}
              onChange={(e) => set("address_line", e.target.value)}
            />
          </Field>

          <div style={styles.row}>
            <Field label="City" error={errors.city} style={{ flex: 1 }}>
              <input
                style={inputStyle(errors.city)}
                placeholder="City"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </Field>
            <Field label="Pincode" error={errors.pincode} style={{ flex: 1 }}>
              <input
                style={inputStyle(errors.pincode)}
                placeholder="6-digit pincode"
                maxLength={6}
                value={form.pincode}
                onChange={(e) => set("pincode", e.target.value.replace(/\D/, ""))}
              />
            </Field>
          </div>

          <Field label="State" error={errors.state}>
            <select
              style={{ ...inputStyle(errors.state), background: "white" }}
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
            >
              <option value="">Select state</option>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>

          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => set("is_default", e.target.checked)}
              style={{ accentColor: "#ff5a1f", width: 16, height: 16 }}
            />
            <span>Set as default address</span>
          </label>

          <div style={styles.modalFooter}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" style={styles.saveBtn} disabled={loading}>
              {loading ? "Saving…" : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Address Card ──────────────────────────────────────────────────────────────
export function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div style={{ ...styles.card, ...(address.is_default ? styles.cardDefault : {}) }}>
      {address.is_default && (
        <span style={styles.defaultBadge}>⭐ Default</span>
      )}

      <div style={styles.addressIcon}>📍</div>

      <div style={styles.addressText}>
        <p style={styles.addressLine}>{address.address_line}</p>
        <p style={styles.addressSub}>
          {address.city}, {address.state} – {address.pincode}
        </p>
      </div>

      {confirmDelete ? (
        <div style={styles.confirmRow}>
          <span style={{ fontSize: 13, color: "#ef4444" }}>Delete this address?</span>
          <button onClick={() => onDelete(address.id)} style={styles.confirmYes}>Yes</button>
          <button onClick={() => setConfirmDelete(false)} style={styles.confirmNo}>No</button>
        </div>
      ) : (
        <div style={styles.cardActions}>
          {!address.is_default && (
            <button onClick={() => onSetDefault(address.id)} style={styles.ghostBtn}>
              Set Default
            </button>
          )}
          <button onClick={() => onEdit(address)} style={styles.editBtn}>Edit</button>
          <button onClick={() => setConfirmDelete(true)} style={styles.deleteBtn}>Delete</button>
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Field({ label, error, children, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      <label style={styles.label}>{label}</label>
      {children}
      {error && <span style={styles.errorMsg}>{error}</span>}
    </div>
  );
}

const inputStyle = (err) => ({
  padding: "10px 12px",
  border: `1.5px solid ${err ? "#ef4444" : "#e5e7eb"}`,
  borderRadius: 10,
  fontSize: 14,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
});

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: 16, backdropFilter: "blur(4px)",
  },
  modal: {
    background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480,
    boxShadow: "0 24px 64px rgba(0,0,0,0.18)", overflow: "hidden",
    animation: "slideUp 0.25s ease",
  },
  modalHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 24px 0",
  },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: "#111" },
  closeBtn: {
    background: "#f3f4f6", border: "none", borderRadius: 8, width: 32, height: 32,
    cursor: "pointer", fontSize: 14, color: "#6b7280", display:"flex",
    alignItems:"center", justifyContent:"center",
  },
  form: { padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 14 },
  row: { display: "flex", gap: 12 },
  label: { fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" },
  errorMsg: { fontSize: 11, color: "#ef4444" },
  checkLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#374151", cursor: "pointer" },
  modalFooter: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 },
  cancelBtn: {
    padding: "10px 20px", border: "1.5px solid #e5e7eb", borderRadius: 10,
    background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#374151",
  },
  saveBtn: {
    padding: "10px 24px", border: "none", borderRadius: 10,
    background: "linear-gradient(135deg, #ff5a1f, #ff8c42)", color: "#fff",
    cursor: "pointer", fontSize: 14, fontWeight: 700, letterSpacing: "0.02em",
  },
  card: {
    background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 16,
    padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10,
    transition: "box-shadow 0.2s, border-color 0.2s", position: "relative",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  cardDefault: {
    border: "1.5px solid #ff5a1f",
    background: "linear-gradient(135deg, #fff8f5, #fff)",
    boxShadow: "0 4px 16px rgba(255,90,31,0.10)",
  },
  defaultBadge: {
    position: "absolute", top: -10, left: 16,
    background: "linear-gradient(135deg, #ff5a1f, #ff8c42)",
    color: "#fff", fontSize: 10, fontWeight: 700,
    padding: "2px 10px", borderRadius: 20, letterSpacing: "0.05em",
  },
  addressIcon: { fontSize: 22 },
  addressText: { flex: 1 },
  addressLine: { margin: 0, fontWeight: 600, fontSize: 15, color: "#111", lineHeight: 1.4 },
  addressSub: { margin: "4px 0 0", fontSize: 13, color: "#6b7280" },
  cardActions: { display: "flex", gap: 8, flexWrap: "wrap" },
  ghostBtn: {
    padding: "6px 14px", border: "1.5px solid #d1d5db", borderRadius: 8,
    background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#374151",
  },
  editBtn: {
    padding: "6px 14px", border: "1.5px solid #3b82f6", borderRadius: 8,
    background: "#eff6ff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#2563eb",
  },
  deleteBtn: {
    padding: "6px 14px", border: "1.5px solid #fca5a5", borderRadius: 8,
    background: "#fff5f5", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#ef4444",
  },
  confirmRow: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  confirmYes: {
    padding: "5px 14px", background: "#ef4444", border: "none", borderRadius: 8,
    color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700,
  },
  confirmNo: {
    padding: "5px 14px", background: "#f3f4f6", border: "none", borderRadius: 8,
    color: "#374151", cursor: "pointer", fontSize: 12, fontWeight: 600,
  },
};
