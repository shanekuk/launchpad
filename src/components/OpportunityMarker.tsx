import { Marker } from "react-map-gl/mapbox";
import type { Opportunity } from "../types";
import { getCauseStyle } from "../utils/causes";

type Props = {
  opportunity: Opportunity;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

export default function OpportunityMarker({
  opportunity,
  isSelected,
  onSelect,
}: Props) {
  const { color, Icon } = getCauseStyle(opportunity.areas_of_interest);
  const size = isSelected ? 44 : 34;

  return (
    <Marker
      longitude={opportunity.lng}
      latitude={opportunity.lat}
      anchor="bottom"
      offset={[0, -size * 0.21]} // lift so the pin's tip sits exactly on the spot
      onClick={(e) => {
        // stop the click from also registering on the map underneath
        e.originalEvent.stopPropagation();
        onSelect(opportunity.id);
      }}
    >
      {/* teardrop: a square with 3 rounded corners, rotated so the sharp corner points down */}
      <div
        title={opportunity.organization}
        style={{
          width: size,
          height: size,
          background: color,
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(-45deg)",
          border: "2px solid white",
          boxShadow: isSelected
            ? "0 0 0 4px rgba(0,0,0,0.12), 0 6px 14px rgba(0,0,0,0.35)"
            : "0 2px 6px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        {/* white circle with the icon, rotated back upright */}
        <div
          style={{
            transform: "rotate(45deg)",
            width: size * 0.6,
            height: size * 0.6,
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={size * 0.34} color={color} strokeWidth={2.5} />
        </div>
      </div>
    </Marker>
  );
}
