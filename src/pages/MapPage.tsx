import { useEffect, useRef, useState } from "react";
import Map, { NavigationControl } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import OpportunityMarker from "../components/OpportunityMarker";
import { useOpportunities } from "../hooks/useOpportunities";
import Sidebar from "../components/Sidebar";
import { useUserLocation } from "../hooks/useUserLocation";
import UserLocationDot from "../components/UserLocationDot";
import LocateUserButton from "../components/LocateUserButton";
import type { LatLng } from "../lib/distance";

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

  // Asks the browser for the user's location when the map opens.
  // location is null until they allow it (and stays null if they don't).
  const { location, status: locationStatus, requestLocation } = useUserLocation();

  // Short message near the locate-me button when we can't get a location
  const [locationHint, setLocationHint] = useState<string | null>(null);

  // hide the message after 5 seconds
  useEffect(() => {
    if (!locationHint) return;
    const t = setTimeout(() => setLocationHint(null), 5000);
    return () => clearTimeout(t);
  }, [locationHint]);

  // Asks if this point inside the area the map can show?
  function isInLA(loc: LatLng) {
    const [[west, south], [east, north]] = LA_BOUNDS;
    return loc.lng >= west && loc.lng <= east && loc.lat >= south && loc.lat <= north;
  }

  function flyToUser(loc: LatLng) {
    // outside LA County the map would stop at its edge, so don't move it
    if (!isInLA(loc)) {
      setLocationHint(
        "You're outside Los Angeles County, so we can't show your location on this map."
      );
      return;
    }
    setLocationHint(null);
    mapRef.current?.flyTo({
      center: [loc.lng, loc.lat],
      zoom: 13,
      duration: 1000,
      padding: { left: PANEL_OFFSET, top: 0, right: 0, bottom: 0 }, // centre it in the visible area, not behind the panel
    });
  }

  // crosshair button – go to the user, or ask for their location first
  async function handleLocateMe() {
    if (location) {
      flyToUser(location);
      return;
    }
    // shows the browser's "Allow location?" prompt
    const result = await requestLocation();
    if (result.location) {
      flyToUser(result.location);
    } else if (result.status === "denied") {
      // the browser won't ask again once location is blocked
      setLocationHint(
        "Location is blocked. Allow it in your browser's site settings (the icon left of the address bar), then try again."
      );
    } else {
      setLocationHint(
        "Couldn't get your location. Check that location services are on, then try again."
      );
    }
  }

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

        {/* blue dot, only when the user shared their location */}
        {location && <UserLocationDot position={location} />}
      </Map>

      {/* the floating panel sits on top of the map */}
      <Sidebar
        opportunities={opportunities}
        selectedId={selectedId}
        onSelect={setSelectedId}
        userLocation={location}
      />

      {/* crosshair button, bottom right */}
      <LocateUserButton
        onClick={handleLocateMe}
        loading={locationStatus === "loading"}
      />

      {/* message when we couldn't get the location */}
      {locationHint && (
        <div
          role="status"
          style={{
            position: "absolute",
            right: 70,
            bottom: 40,
            maxWidth: 280,
            padding: "10px 12px",
            borderRadius: 10,
            background: "white",
            color: "#334155",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            fontFamily: "system-ui, sans-serif",
            fontSize: 13,
            lineHeight: 1.4,
            zIndex: 1,
          }}
        >
          {locationHint}
        </div>
      )}
    </div>
  );
}