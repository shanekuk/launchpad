import type { CSSProperties } from "react";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import type { Opportunity } from "../types";
import { getCauseStyle, splitAreas } from "../utils/causes";
import { distanceMiles, formatMiles, type LatLng } from "../lib/distance";
import SortControl, { type SortOption } from "./SortByDistanceDropDown";
import { CardPlaceholder, Thumbnail } from "./OpportunityCardPlaceholder";

type Props = {
  opportunities: Opportunity[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  userLocation: LatLng | null;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
};

export default function Sidebar({
  opportunities,
  selectedId,
  onSelect,
  userLocation,
  sortBy,
  onSortChange,
}: Props) {
  const selected = opportunities.find((o) => o.id === selectedId);

  return (
    <aside style={panelStyle}>
      {selected ? (
        <DetailPlaceholder
          opportunity={selected}
          userLocation={userLocation}
          onBack={() => onSelect(null)}
        />
      ) : (
        <>
          <h2
            style={{
              margin: 0,
              padding: "20px 20px 4px",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {opportunities.length} opportunities in Los Angeles
          </h2>
          {/* Sort by dropdown, under the heading */}
          <div style={{ padding: "8px 20px 4px" }}>
            <SortControl value={sortBy} onChange={onSortChange} />
          </div>
          {opportunities.map((o, i) => (
            <CardPlaceholder
              key={o.id}
              opportunity={o}
              userLocation={userLocation}
              onSelect={onSelect}
              isLast={i === opportunities.length - 1}
            />
          ))}
        </>
      )}
    </aside>
  );
}

// the floating white panel over the map
const panelStyle: CSSProperties = {
  position: "absolute",
  top: 16,
  left: 16,
  bottom: 16,
  width: 380,
  background: "white",
  borderRadius: 24,
  boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
  overflowY: "auto", // long results scroll inside the panel
  zIndex: 1,
  fontFamily: "system-ui, sans-serif",
  color: "#0f172a",
};

// TEMP: replace with the Listings team's OpportunityDetail
function DetailPlaceholder({
  opportunity,
  userLocation,
  onBack,
}: {
  opportunity: Opportunity;
  userLocation: LatLng | null;
  onBack: () => void;
}) {
  const { color } = getCauseStyle(opportunity.areas_of_interest);

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          border: "none",
          background: "none",
          padding: 0,
          cursor: "pointer",
          fontSize: 14,
          color: "#334155",
          font: "inherit",
        }}
      >
        <ArrowLeft size={18} /> Back to results
      </button>

      <div style={{ marginTop: 16 }}>
        <Thumbnail
          areas={opportunity.areas_of_interest}
          width="100%"
          height={160}
        />
      </div>

      <h2 style={{ margin: "16px 0 10px", fontSize: 22, lineHeight: 1.25 }}>
        {opportunity.organization}
      </h2>

      {/* all areas as tinted chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {splitAreas(opportunity.areas_of_interest).map((area) => (
          <span
            key={area}
            style={{
              background: color + "1A", // the cause colour at ~10% opacity
              color,
              borderRadius: 999,
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {area}
          </span>
        ))}
      </div>

      <p
        style={{
          marginTop: 16,
          fontSize: 15,
          lineHeight: 1.6,
          color: "#334155",
        }}
      >
        {opportunity.description}
      </p>

      {/* distance from the user – only when they shared their location */}
      {userLocation && (
        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            margin: "0 0 16px",
            fontSize: 14,
            color: "#64748b",
          }}
        >
          <MapPin size={16} />
          {formatMiles(distanceMiles(userLocation, opportunity))} away
        </p>
      )}

      <a
        href={opportunity.link}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginTop: 8,
          padding: "10px 18px",
          borderRadius: 999,
          background: "#0f172a",
          color: "white",
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        Visit website <ExternalLink size={16} />
      </a>
    </div>
  );
}