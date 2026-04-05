import { useRef } from "react";

export default function ProfileHeader({ user, uploading, onAvatarChange }) {
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (user.avatar_url?.startsWith("blob:")) {
      URL.revokeObjectURL(user.avatar_url);
    }

    const previewUrl = URL.createObjectURL(file);
    onAvatarChange(previewUrl); // Profile.jsx handles the API call — don't do it here too
    e.target.value = "";
  }

  const initials = (user.name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="ww-card ww-profile-header">
      <div className="ww-avatar-wrap">
        <div
          className="ww-avatar"
          style={user.avatar_url ? { backgroundImage: `url(${user.avatar_url})` } : {}}
          role="img"
          aria-label={`${user.name ?? "User"}'s profile picture`}
        >
          {!user.avatar_url && (
            <span className="ww-avatar-initials">{initials}</span>
          )}
        </div>

        <button
          className="ww-avatar-change-btn"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          title="Change profile photo"
          aria-label="Upload new profile picture"
        >
          <CameraIcon />
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFile}
        />
      </div>

      <div className="ww-header-info">
        <h2 className="ww-header-name">{user.name ?? "—"}</h2>
        <p className="ww-header-email">{user.email ?? "—"}</p>
        <button
          className="ww-upload-text-btn"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Saving…" : "Change photo"}
        </button>
      </div>

      <div className="ww-header-deco" aria-hidden="true">🥐</div>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}