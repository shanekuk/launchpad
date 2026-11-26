import { Marker } from "react-map-gl/mapbox";
import type { LatLng } from "../lib/distance";

// The blue "you are here" dot. Must be rendered inside <Map>.
export default function UserLocationDot({ position }: { position: LatLng }) {
  return (
    <Marker longitude={position.lng} latitude={position.lat} anchor="center">
      <div
        aria-label="Your location"
        title="You are here"
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#2563eb",
          border: "3px solid white",
          boxShadow:
            "0 0 0 6px rgba(37, 99, 235, 0.2), 0 1px 4px rgba(0, 0, 0, 0.3)",
        }}
      />
    </Marker>
  );
}