import { useEffect, useRef, useState } from "react";
import Map, { NavigationControl } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import OpportunityMarker from "../components/OpportunityMarker";
import { useOpportunities } from "../hooks/useOpportunities";
import Sidebar from "../components/Sidebar";
// NEW
import { useUserLocation } from "../hooks/useUserLocation";
import UserLocationDot from "../components/UserLocationDot";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

// center of downtown LA
const LA_CENTER = { longitude: -118.2437, latitude: 34.0522 };

// rough bounds of LA County,
const LA_BOUNDS: [[number, number], [number, number]] = [
  [-119.2, 33.5], // southwest
  [-117.4, 34.9], // northeast
];

// space the floating panel covers on the left (16 margin + 380 panel + 16 gap)
const PANEL_OFFSET = 412;

export default function MapPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { opportunities, isLoading, error } = useOpportunities();
  const mapRef = useRef<MapRef>(null);

  // NEW: asks the browser for the user's location when the map opens.
  // location is null until they allow it (and stays null if they don't).
  const { location } = useUserLocation();

  // whenever the selection changes, fly the map to that opportunity
  useEffect(() => {
    const selected = opportunities.find((o) => o.id === selectedId);
    if (!selected) {
      mapRef.current?.flyTo({
        center: [LA_CENTER.longitude, LA_CENTER.latitude],
        zoom: 10,
        duration: 1000,
      });
      return;
    }
    mapRef.current?.flyTo({
      center: [selected.lng, selected.lat],
      zoom: 14,
      duration: 1200, // milliseconds
      padding: { left: PANEL_OFFSET, top: 0, right: 0, bottom: 0 }, // centre it in the visible area, not behind the panel
    });
  }, [selectedId, opportunities]);

  const status =
    error ??
    (isLoading ? "Loading opportunities…" : null) ??
    (opportunities.length === 0 ? "No opportunities found" : null);

  if (!MAPBOX_TOKEN) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        Missing <code>VITE_MAPBOX_TOKEN</code>. Copy <code>.env.example</code>{" "}
        to <code>.env</code>, add your Mapbox public token, and restart the dev
        server.
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* the map fills the whole screen */}
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{ ...LA_CENTER, zoom: 10 }}
        maxBounds={LA_BOUNDS}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%" }}
        onClick={() => setSelectedId(null)}
      >
        <NavigationControl position="top-right" />
        {status && (
          <div
            role={error ? "alert" : "status"}
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "8px 12px",
              borderRadius: 6,
              background: error ? "#fee2e2" : "white",
              color: error ? "#991b1b" : "#334155",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              fontFamily: "system-ui, sans-serif",
              fontSize: 14,
            }}
          >
            {status}
          </div>
        )}
        {opportunities.map((opportunity) => (
          <OpportunityMarker
            key={opportunity.id}
            opportunity={opportunity}
            isSelected={opportunity.id === selectedId}
            onSelect={setSelectedId}
          />
        ))}

        {/* NEW: blue dot, only when the user shared their location */}
        {location && <UserLocationDot position={location} />}
      </Map>

      {/* the floating panel sits on top of the map */}
      <Sidebar
        opportunities={opportunities}
        selectedId={selectedId}
        onSelect={setSelectedId}
        userLocation={location}
      />
    </div>
  );
}