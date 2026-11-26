import { useCallback, useEffect, useState } from "react";
import type { LatLng } from "../lib/distance";

// idle        – haven't asked yet
// loading     – waiting on the browser
// granted     – we have a location
// denied      – user said no (or blocked it earlier); the browser won't re-prompt
// unavailable – browser has no geolocation, or it timed out / failed
export type LocationStatus =
  | "idle"
  | "loading"
  | "granted"
  | "denied"
  | "unavailable";

export function useUserLocation({ requestOnMount = true } = {}) {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");

  // Ask the browser for the user's location. Resolves with the location,
  // or null if they didn't share it, so callers can act right away.
  const requestLocation = useCallback((): Promise<LatLng | null> => {
    if (!("geolocation" in navigator)) {
      setStatus("unavailable");
      return Promise.resolve(null);
    }
    setStatus("loading");
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(loc);
          setStatus("granted");
          resolve(loc);
        },
        (err) => {
          setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable");
          resolve(null);
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  useEffect(() => {
    if (requestOnMount) requestLocation();
  }, [requestOnMount, requestLocation]);

  return { location, status, requestLocation };
}