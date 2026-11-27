import { useEffect } from "react";
import type { LocationStatus } from "../hooks/useUserLocation";

type Props = {
  open: boolean;
  status: LocationStatus;
  onShare: () => void;
  onClose: () => void;
};

// Popup asking the user to share their location so the list can sort by distance.
export default function LocationPrompt({ open, status, onShare, onClose }: Props) {
  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  // Once location is blocked, the browser won't ask again,
  // so tell the user how to turn it back on.
  const message =
    status === "denied"
      ? "Location is blocked for this site. Allow it in your browser's site settings (the icon to the left of the address bar), then try again."
      : status === "unavailable"
        ? "We couldn't get your location. Check that location services are on, then try again."
        : "We'll use your location to show the closest opportunities first.";

  const loading = status === "loading";
  const shareLabel = loading
    ? "Locating…"
    : status === "denied" || status === "unavailable"
      ? "Try again"
      : "Share location";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.4)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-prompt-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          width: "min(380px, 90vw)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          fontFamily: "system-ui, sans-serif",
          color: "#0f172a",
        }}
      >
        <h2 id="location-prompt-title" style={{ margin: "0 0 8px", fontSize: 18 }}>
          Turn on location to sort by distance
        </h2>
        <p style={{ margin: "0 0 20px", color: "#475569", fontSize: 14, lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid #cbd5e1",
              background: "white",
              color: "#0f172a",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Not now
          </button>
          <button
            type="button"
            onClick={onShare}
            disabled={loading}
            autoFocus
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "none",
              background: "#0f172a",
              color: "white",
              fontSize: 14,
              fontWeight: 500,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {shareLabel}
          </button>
        </div>
      </div>
    </div>
  );
}