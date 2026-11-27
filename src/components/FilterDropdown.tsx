import { useEffect, useRef, useState } from "react";
import { ArrowDown, Check } from "lucide-react";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface FilterDropdownProps<T extends string> {
  label: string; // text shown on the button, e.g. "Within 10mi"
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

// Pill button that opens a small menu. Closes on outside click or Escape.
export default function FilterDropdown<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="saved-dropdown" ref={ref}>
      <button
        type="button"
        className="saved-pill-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <ArrowDown size={14} strokeWidth={2.25} />
      </button>

      {open && (
        <ul className="saved-dropdown-menu" role="listbox">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                className="saved-dropdown-item"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
                {option.value === value && <Check size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}