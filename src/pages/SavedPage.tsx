import { useCallback, useMemo, useState } from "react";
import { Bookmark } from "lucide-react";
import FilterDropdown from "../components/FilterDropdown";
import { CardPlaceholder } from "../components/OpportunityCardPlaceholder";
import LocationPrompt from "../components/LocationPrompt";
import type { SortOption } from "../components/SortByDistanceDropDown";
import { useOpportunities } from "../hooks/useOpportunities";
import { useUserLocation } from "../hooks/useUserLocation";
import { distanceMiles } from "../lib/distance";
import "../css/SavedPage.css";

type DistanceFilter = "any" | "1" | "5" | "10" | "25";

const DISTANCE_OPTIONS: { value: DistanceFilter; label: string }[] = [
  { value: "any", label: "Any distance" },
  { value: "1", label: "Within 1mi" },
  { value: "5", label: "Within 5mi" },
  { value: "10", label: "Within 10mi" },
  { value: "25", label: "Within 25mi" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "closest", label: "Closest distance" },
];

// A distance or sort choice waiting on the user's location.
type Pending = { kind: "distance"; value: DistanceFilter } | { kind: "sort"; value: SortOption };

export default function SavedPage() {
  // TODO (saved filter): this loads EVERY opportunity for now.
  // Once we know how saves are stored, keep only the saved ones here, e.g.
  //   const saved = opportunities.filter((o) => savedIds.includes(o.id));
  // and use `saved` instead of `opportunities` below.
  const { opportunities, isLoading, error } = useOpportunities();

  // Don't ask for location when the page opens; only when a distance option is picked.
  const { location, status: locationStatus, requestLocation } = useUserLocation({
    requestOnMount: false,
  });

  const [distance, setDistance] = useState<DistanceFilter>("any");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [pending, setPending] = useState<Pending | null>(null);

  function apply(choice: Pending) {
    if (choice.kind === "distance") setDistance(choice.value);
    else setSortBy(choice.value);
  }

  // Distance filter and "Closest distance" need location; without it, open the popup.
  function choose(choice: Pending) {
    const needsLocation = choice.kind === "distance" ? choice.value !== "any" : choice.value === "closest";
    if (needsLocation && !location) {
      setPending(choice);
      return;
    }
    apply(choice);
  }

  // "Share location" in the popup
  async function handleShareLocation() {
    const result = await requestLocation();
    if (!result.location) return; // popup stays open and says why
    if (pending) apply(pending);
    setPending(null);
  }

  const closeLocationPrompt = useCallback(() => setPending(null), []);

  // No detail view on this page yet, so clicking a card opens the organization's website.
  function openWebsite(id: string) {
    const opportunity = opportunities.find((o) => o.id === id);
    if (opportunity) window.open(opportunity.link, "_blank", "noreferrer");
  }

  const visible = useMemo(() => {
    let list = opportunities;
    if (distance !== "any" && location) {
      list = list.filter((o) => distanceMiles(location, o) <= Number(distance));
    }
    if (sortBy === "closest" && location) {
      list = [...list].sort((a, b) => distanceMiles(location, a) - distanceMiles(location, b));
    }
    return list;
  }, [opportunities, distance, sortBy, location]);

  const distanceLabel = DISTANCE_OPTIONS.find((o) => o.value === distance)!.label;

  return (
    <main className="saved-page">
      <h1 className="saved-title">Saved Opportunities</h1>

      {/* Filters team: search bar + cause filter go at the start of this row. */}
      <div className="saved-toolbar">
        <FilterDropdown
          label={distanceLabel}
          options={DISTANCE_OPTIONS}
          value={distance}
          onChange={(value) => choose({ kind: "distance", value })}
        />
        <FilterDropdown
          label={sortBy === "closest" ? "Closest distance" : "Sort by"}
          options={SORT_OPTIONS}
          value={sortBy}
          onChange={(value) => choose({ kind: "sort", value })}
        />
      </div>

      {!isLoading && !error && opportunities.length > 0 && (
        <p className="saved-summary">{opportunities.length} saved</p>
      )}

      {error ? (
        <p className="saved-status-text" role="alert">{error}</p>
      ) : isLoading ? (
        <p className="saved-status-text">Loading saved opportunities…</p>
      ) : opportunities.length === 0 ? (
        <div className="saved-empty">
          <Bookmark size={32} />
          <h2>No saved opportunities yet</h2>
          <p>Tap the bookmark on any opportunity to save it here.</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="saved-empty">
          <h2>Nothing saved within {distance} mi</h2>
          <button type="button" className="saved-clear" onClick={() => setDistance("any")}>
            Show any distance
          </button>
        </div>
      ) : (
        <div className="saved-grid">
          {visible.map((o) => (
            <div key={o.id} className="saved-card">
              {/* same card the Map sidebar uses */}
              <CardPlaceholder
                opportunity={o}
                userLocation={location}
                onSelect={openWebsite}
                isLast
              />
            </div>
          ))}
        </div>
      )}

      {/* same "Turn on location" popup as the Map page */}
      <LocationPrompt
        open={pending !== null}
        status={locationStatus}
        onShare={handleShareLocation}
        onClose={closeLocationPrompt}
      />
    </main>
  );
}