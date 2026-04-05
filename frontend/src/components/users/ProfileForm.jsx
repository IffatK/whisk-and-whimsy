import { useState, useEffect } from "react";

// ── Validation ────────────────────────────────────────────────────────────────
function validate(fields) {
  const errors = {};

  // Name
  if (!fields.name.trim()) {
    errors.name = "Name is required.";
  } else if (fields.name.trim().length > 100) {
    errors.name = "Name must be 100 characters or fewer.";
  }

  // Phone (India focused)
  if (fields.phone.trim() && !/^[6-9]\d{9}$/.test(fields.phone.trim())) {
    errors.phone = "Enter a valid 10-digit phone number.";
  }

  // Address
  if (!fields.address.trim()) {
    errors.address = "Address is required.";
  } else if (fields.address.length > 300) {
    errors.address = "Address must be 300 characters or fewer.";
  }

  return errors;
}

/**
 * ProfileForm
 */
export default function ProfileForm({ user, saving, error, onSave }) {
  const [form, setForm] = useState({
    name: user.name ?? "",
    phone: user.phone ?? "",
    address: user.address ?? "",
  });

  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setForm({
      name: user.name ?? "",
      phone: user.phone ?? "",
      address: user.address ?? "",
    });
    setDirty(false);
    setErrors({});
  }, [user.name, user.phone, user.address]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((f) => ({ ...f, [name]: value }));
    setDirty(true);

    // 🔥 live validation (this is what you were missing)
    const newErrors = validate({ ...form, [name]: value });
    setErrors(newErrors);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    onSave({
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    });
  }

  function handleDiscard() {
    setForm({
      name: user.name ?? "",
      phone: user.phone ?? "",
      address: user.address ?? "",
    });
    setErrors({});
    setDirty(false);
  }

  return (
    <div className="ww-card">
      <div className="ww-card-header">
        <h3 className="ww-card-title">
          <span className="ww-card-title-icon">✏️</span> Personal Details
        </h3>
        <p className="ww-card-subtitle">
          These details are used at checkout and cannot include your email.
        </p>
      </div>

      {error && (
        <div className="ww-server-error" role="alert">
          ⚠️ {error}
        </div>
      )}

      <form className="ww-form" onSubmit={handleSubmit} noValidate>
        <div className="ww-form-grid">

          {/* Name */}
          <div className="ww-field">
            <label className="ww-label">Full Name</label>
            <input
              className={`ww-input${errors.name ? " ww-input--error" : ""}`}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={saving}
            />
            {errors.name && <span className="ww-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="ww-field">
            <label className="ww-label">
              Email Address <span className="ww-locked-pill">locked</span>
            </label>
            <input
              className="ww-input ww-input--locked"
              type="email"
              value={user.email ?? ""}
              disabled
              readOnly
            />
          </div>

          {/* Phone */}
          <div className="ww-field">
            <label className="ww-label">Phone Number</label>
            <input
              className={`ww-input${errors.phone ? " ww-input--error" : ""}`}
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={saving}
            />
            {errors.phone && <span className="ww-error">{errors.phone}</span>}
          </div>

          {/* Address */}
          <div className="ww-field ww-field--full">
            <label className="ww-label">Delivery Address</label>
            <textarea
              className={`ww-input ww-textarea${errors.address ? " ww-input--error" : ""}`}
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              disabled={saving}
            />
            {errors.address && <span className="ww-error">{errors.address}</span>}
          </div>

        </div>

        <div className="ww-form-actions">
          <button
            type="submit"
            className="ww-btn ww-btn--primary"
            disabled={!dirty || saving}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>

          {dirty && !saving && (
            <button
              type="button"
              className="ww-btn ww-btn--ghost"
              onClick={handleDiscard}
            >
              Discard
            </button>
          )}
        </div>
      </form>
    </div>
  );
}