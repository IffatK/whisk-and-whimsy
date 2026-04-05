// UI.jsx
export function Loading({ text = "Loading..." }) {
  return (
    <div style={{
      minHeight: 180,
      display: "grid",
      placeItems: "center",
      color: "var(--choco-mid)",
      fontWeight: 600,
    }}>
      {text}
    </div>
  );
}