import type { CSSProperties } from "react";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import type { Opportunity } from "../types";
import { getCauseStyle, splitAreas } from "../utils/causes";
import { distanceMiles, formatMiles, type LatLng } from "../lib/distance";

type Props = {
  opportunities: Opportunity[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  userLocation: LatLng | null;
};

export default function Sidebar({
  opportunities,
  selectedId,
  onSelect,
  userLocation,
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

// coloured tile with the cause icon (stand-in for a photo)
function Thumbnail({
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

// TEMP: replace with the Listings team's OpportunityCard
function CardPlaceholder({
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