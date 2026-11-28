import { MapPin } from "lucide-react";
import type { Opportunity } from "../types";
import { getCauseStyle, splitAreas } from "../utils/causes";
import { distanceMiles, formatMiles, type LatLng } from "../lib/distance";

// Shared by the Map sidebar and the Saved page.
// TEMP: replace with the Listings team's OpportunityCard (both pages update at once).

// coloured tile with the cause icon (stand-in for a photo)
export function Thumbnail({
  areas,
  width,
  height,
  label,
}: {
  areas: string;
  width: number | string;
  height: number;
  label?: string;
}) {
  const { color, Icon } = getCauseStyle(areas);
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        flexShrink: 0,
        borderRadius: 16,
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={height * 0.4} color="white" strokeWidth={2} />
      {label && (
        <span
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "rgba(255,255,255,0.9)",
            borderRadius: 999,
            padding: "2px 8px",
            fontSize: 11,
            color: "#334155",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// "https://www.lafoodbank.org/volunteer" → "lafoodbank.org"
function domainOf(link: string) {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return link;
  }
}

export function CardPlaceholder({
  opportunity,
  userLocation,
  onSelect,
  isLast,
}: {
  opportunity: Opportunity;
  userLocation: LatLng | null;
  onSelect: (id: string) => void;
  isLast: boolean;
}) {
  const firstArea = splitAreas(opportunity.areas_of_interest)[0];

  return (
    <button
      onClick={() => onSelect(opportunity.id)}
      style={{
        display: "flex",
        gap: 14,
        width: "calc(100% - 40px)",
        margin: "0 20px",
        padding: "16px 0",
        textAlign: "left",
        border: "none",
        borderBottom: isLast ? "none" : "1px solid #e2e8f0",
        background: "none",
        cursor: "pointer",
        font: "inherit",
        color: "inherit",
      }}
    >
      <Thumbnail
        areas={opportunity.areas_of_interest}
        width={112}
        height={112}
        label={firstArea}
      />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}>
          {opportunity.organization}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 14,
            color: "#475569",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 3, // cut long descriptions after 3 lines
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {opportunity.description}
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: "#64748b" }}>
          {domainOf(opportunity.link)}
        </div>

        {/* distance, under the website – only if location is shared */}
        {userLocation && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 4,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            <MapPin size={14} />
            {formatMiles(distanceMiles(userLocation, opportunity))}
          </div>
        )}
      </div>
    </button>
  );
}