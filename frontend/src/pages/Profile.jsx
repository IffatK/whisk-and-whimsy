import { useState, useEffect, useCallback } from "react";
import ProfileHeader from "../components/users/ProfileHeader";
import ProfileForm   from "../components/users/ProfileForm";
import OrderHistory  from "../components/users/OrderHistory";
import Wishlist      from "../components/users/Wishlist";
import {
  fetchUserProfile,
  updateUserProfile,
  fetchUserOrders,
  fetchUserWishlist,
  removeWishlistItem,
} from "../services/api";
import "../styles/profile.css";

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div className={`ww-toast ww-toast--${type}`} role="status" aria-live="polite">
      {type === "success" ? "✓" : "⚠️"}&nbsp;&nbsp;{message}
    </div>
  );
}

export default function Profile() {
  const [user,     setUser]     = useState(null);
  const [orders,   setOrders]   = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [loading,         setLoading]         = useState(true);
  const [saving,          setSaving]          = useState(false);
  const [ordersLoading,   setOrdersLoading]   = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  const [toast,     setToast]     = useState({ message: "", type: "success" });
  const [formError, setFormError] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  useEffect(() => {
    if (!toast.message) return;
    const t = setTimeout(() => setToast({ message: "", type: "success" }), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const loadProfile = useCallback(async () => {
  try {
    setLoading(true);
    const res = await fetchUserProfile();
    // axios wraps in res.data, and backend sends { success, data: {...} }
    const user = res?.data?.data ?? res?.data ?? res;
    setUser(user);
  } catch (err) {
    showToast(err.message ?? "Failed to load profile.", "error");
  } finally {
    setLoading(false);
  }
}, []);

  const loadOrders = useCallback(async () => {
  try {
    setOrdersLoading(true);
    const res = await fetchUserOrders();
    // handle all possible shapes: array, {data:[]}, axios {data:{data:[]}}
    const arr = Array.isArray(res) ? res
              : Array.isArray(res?.data) ? res.data
              : Array.isArray(res?.data?.data) ? res.data.data
              : [];
    setOrders(arr);
  } catch {
    setOrders([]);
  } finally {
    setOrdersLoading(false);
  }
}, []);

 const loadWishlist = useCallback(async () => {
  try {
    setWishlistLoading(true);
    const res = await fetchUserWishlist();
    const arr = Array.isArray(res) ? res
              : Array.isArray(res?.data) ? res.data
              : Array.isArray(res?.data?.data) ? res.data.data
              : [];
    setWishlist(arr);
  } catch {
    setWishlist([]);
  } finally {
    setWishlistLoading(false);
  }
}, []);

  useEffect(() => {
    loadProfile();
    loadOrders();
    loadWishlist();
  }, [loadProfile, loadOrders, loadWishlist]);

  async function handleAvatarChange(previewUrl) {
    if (!user) return;
    const prevAvatar = user.avatar_url;
    setUser((prev) => ({ ...prev, avatar_url: previewUrl }));
    try {
      setSaving(true);
      const res = await updateUserProfile({ avatar_url: previewUrl });
      setUser(res.data ?? res);
      showToast("Profile photo updated.");
    } catch (err) {
      showToast(err.message, "error");
      setUser((prev) => ({ ...prev, avatar_url: prevAvatar }));
    } finally {
      setSaving(false);
    }
  }

  async function handleProfileSave(payload) {
    setFormError(null);
    setSaving(true);
    try {
      const res = await updateUserProfile(payload);
      setUser(res.data ?? res);
      showToast("Profile updated successfully!");
    } catch (err) {
      setFormError(err.message);
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  // wishlist_id is the correct PK — NOT product_id
  async function handleRemoveWishlist(wishlistId) {
    const previous = wishlist;
    setWishlist((prev) => prev.filter((i) => i.wishlist_id !== wishlistId));
    try {
      await removeWishlistItem(wishlistId);
    } catch {
      setWishlist(previous);
      showToast("Could not remove item. Try again.", "error");
    }
  }

  if (loading) {
    return (
      <div className="ww-profile-page">
        <div className="ww-profile-container">
          <div className="ww-profile-heading">
            <span className="ww-profile-heading-icon">🧁</span>
            <div>
              <h1 className="ww-profile-title">My Profile</h1>
              <p className="ww-profile-subtitle">Loading your account…</p>
            </div>
          </div>
          <div className="ww-card ww-skeleton-header" />
          <div className="ww-card ww-skeleton-form"   />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="ww-profile-page">
        <div className="ww-profile-container">
          <div className="ww-empty">
            <span className="ww-empty-icon">🔒</span>
            <p>Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ww-profile-page">
      <div className="ww-profile-container">
        <div className="ww-profile-heading">
          <span className="ww-profile-heading-icon">🧁</span>
          <div>
            <h1 className="ww-profile-title">My Profile</h1>
            <p className="ww-profile-subtitle">Manage your Whisk &amp; Whimsy account</p>
          </div>
        </div>

        <Toast message={toast.message} type={toast.type} />

        <ProfileHeader
          user={user}
          uploading={saving}
          onAvatarChange={handleAvatarChange}
        />

        <ProfileForm
          user={user}
          saving={saving}
          error={formError}
          onSave={handleProfileSave}
        />

        {/* OrderHistory receives raw backend shape — no normalization needed */}
        <OrderHistory
          orders={orders}
          loading={ordersLoading}
        />

        {/* Wishlist receives raw backend shape — onRemove gets wishlist_id */}
        <Wishlist
          items={wishlist}
          loading={wishlistLoading}
          onRemove={handleRemoveWishlist}
          onRefresh={loadWishlist}
        />
      </div>
    </div>
  );
}