export type SortOption = "default" | "closest";

type Props = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

// "Sort by" dropdown for the sidebar list.
// It's controlled: if onChange doesn't update `value` (e.g. the location popup
// opens instead), the dropdown stays on the old option.
export default function SortByDistanceDropDown({ value, onChange }: Props) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 13,
        color: "#475569",
        whiteSpace: "nowrap",
      }}
    >
      Sort by
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        style={{
          padding: "4px 8px",
          borderRadius: 8,
          border: "1px solid #cbd5e1",
          background: "white",
          color: "#0f172a",
          fontSize: 13,
          font: "inherit",
          cursor: "pointer",
        }}
      >
        <option value="default">Default</option>
        <option value="closest">Closest distance</option>
      </select>
    </label>
  );
}