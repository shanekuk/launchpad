import { LocateFixed } from "lucide-react";

type Props = {
  onClick: () => void;
  loading?: boolean;
};

// Crosshair button at the bottom right of the map that recenters on the user.
// Render it outside <Map>, inside MapPage's `position: relative` wrapper.
export default function LocateMeButton({ onClick, loading = false }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-label="Center map on my location"
      title="My location"
      style={{
        position: "absolute",
        right: 16,
        bottom: 40, // sits above Mapbox's attribution text
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: "none",
        background: "white",
        color: "#0f172a",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
        display: "grid",
        placeItems: "center",
        cursor: loading ? "wait" : "pointer",
        opacity: loading ? 0.6 : 1,
        zIndex: 1,
      }}
    >
      <LocateFixed size={22} />
    </button>
  );
}