// src/pages/Settings.jsx
import { useState, useEffect } from 'react';
import { Loading } from '../UI';                          // ✅ named export now exists
import { settingsAPI, authAPI, supabase } from "../../lib/supabaseClient";
import { useOutletContext } from 'react-router-dom';
const NOTIFICATION_TOGGLES = [
  { key: 'notif_new_order',     label: 'New Order Alerts',   sub: 'Get notified when a new order is placed' },
  { key: 'notif_low_stock',     label: 'Low Stock Warnings', sub: 'Alert when product stock falls below 5' },
  { key: 'notif_payment_fail',  label: 'Payment Failures',   sub: 'Notify on failed payment attempts' },
  { key: 'notif_daily_summary', label: 'Daily Summary',      sub: 'Receive daily revenue & order report' },
  { key: 'notif_user_reg',      label: 'User Registrations', sub: 'Alert on new user signups' },
];

const SYSTEM_TOGGLES = [
  { key: 'sys_maintenance',   label: 'Maintenance Mode',     sub: 'Temporarily disable storefront for users' },
  { key: 'sys_realtime',      label: 'Realtime Updates',     sub: 'Live order sync via WebSocket' },
  { key: 'sys_auto_stock',    label: 'Auto Stock Deduction', sub: 'Decrease stock on order placement' },
  { key: 'sys_cod',           label: 'COD Payments',         sub: 'Allow Cash on Delivery orders' },
  { key: 'sys_guest_checkout', label: 'Guest Checkout',      sub: 'Allow orders without account' },
];

function Settings() {
  const { user, showToast } = useOutletContext();
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [settings, setSettings]   = useState({});

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail]             = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [bakeryName, setBakeryName]     = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone]               = useState('');
  const [address, setAddress]           = useState('');

  useEffect(() => {
    settingsAPI.getAll()
      .then(data => {
        setSettings(data);
        setBakeryName(data.bakery_name    || 'Whisk & Whimsy');
        setContactEmail(data.contact_email || 'hello@whiskwhimsy.com');
        setPhone(data.phone               || '+91 98765 43210');
        setAddress(data.address           || '12, Pastry Lane, Bandra West, Mumbai - 400050');
      })
      .catch(err => showToast('⚠️ ' + err.message))
      .finally(() => setLoading(false));

    setDisplayName(user?.user_metadata?.name || 'Admin User');
    setEmail(user?.email || 'admin@whiskwhimsy.com');
  }, [user]);

  const setToggle = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const saveAccount = async () => {
  setSaving(true);
  try {
    const updates = { data: { name: displayName } };
    if (newPassword) updates.password = newPassword;
    const { error } = await supabase.auth.updateUser(updates); // ✅ no dynamic import
    if (error) throw error;
    setNewPassword('');
    showToast('✅ Account settings saved!');
  } catch (err) {
    showToast('⚠️ ' + err.message);
  }
  setSaving(false);
};

  const saveBakery = async () => {
    setSaving(true);
    try {
      await settingsAPI.setMany({ bakery_name: bakeryName, contact_email: contactEmail, phone, address });
      showToast('✅ Bakery info saved!');
    } catch (err) {
      showToast('⚠️ ' + err.message);
    }
    setSaving(false);
  };

  const saveToggle = async (key, val) => {
    setToggle(key, val);
    try {
      await settingsAPI.set(key, val);
      showToast('🔔 Preference saved');
    } catch (err) {
      showToast('⚠️ ' + err.message);
    }
  };

  if (loading) return <Loading text="Loading settings…" />;

  const initials = (displayName || 'AU').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-header-title">⚙️ Settings</div>
          <div className="page-header-sub">Manage admin preferences & configurations</div>
        </div>
      </div>

      <div className="profile-header">
        <div className="profile-avatar-lg">{initials}</div>
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700 }}>{displayName}</div>
          <div style={{ color: 'var(--choco-mid)', fontSize: 14 }}>{email}</div>
          <div style={{ marginTop: 8 }}>
            <span className="role-pill role-admin">SUPER ADMIN</span>
          </div>
        </div>
      </div>

      <div className="settings-grid">
        <div className="card">
          <div className="settings-section">Account Settings</div>
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input className="form-input" value={displayName} onChange={e => setDisplayName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" value={email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input className="form-input" type="password" value={newPassword}
              onChange={e => setNewPassword(e.target.value)} placeholder="Leave blank to keep current" />
          </div>
          <button className="btn-primary" onClick={saveAccount} disabled={saving}>
            {saving ? '⏳ Saving…' : 'Save Changes'}
          </button>
        </div>

        <div className="card">
          <div className="settings-section">Bakery Information</div>
          <div className="form-group">
            <label className="form-label">Bakery Name</label>
            <input className="form-input" value={bakeryName} onChange={e => setBakeryName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Email</label>
            <input className="form-input" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea className="form-input" rows="2" value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={saveBakery} disabled={saving}>
            {saving ? '⏳ Saving…' : 'Save Info'}
          </button>
        </div>

        <div className="card">
          <div className="settings-section">Notifications</div>
          {NOTIFICATION_TOGGLES.map(t => (
            <div className="toggle-row" key={t.key}>
              <div>
                <div className="toggle-label">{t.label}</div>
                <div className="toggle-sub">{t.sub}</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={!!settings[t.key]} onChange={e => saveToggle(t.key, e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="settings-section">System</div>
          {SYSTEM_TOGGLES.map(t => (
            <div className="toggle-row" key={t.key}>
              <div>
                <div className="toggle-label">{t.label}</div>
                <div className="toggle-sub">{t.sub}</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={!!settings[t.key]} onChange={e => saveToggle(t.key, e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 20, border: '1px solid #FECACA' }}>
        <div className="settings-section" style={{ color: '#DC2626' }}>Danger Zone</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Sign Out</div>
            <div style={{ fontSize: 12, color: 'var(--choco-light)' }}>End your current admin session</div>
          </div>
          <button className="btn-danger" onClick={() => authAPI.signOut()}>↩ Sign Out</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;