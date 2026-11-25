import {
  Utensils,
  Leaf,
  GraduationCap,
  PawPrint,
  Home,
  HeartHandshake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CauseStyle = { color: string; Icon: LucideIcon };

// colour + icon per cause, matched by keyword
const CAUSES: (CauseStyle & { keyword: string })[] = [
  { keyword: "Food", color: "#f59e0b", Icon: Utensils },
  { keyword: "Environment", color: "#16a34a", Icon: Leaf },
  { keyword: "Education", color: "#2563eb", Icon: GraduationCap },
  { keyword: "Animal", color: "#9333ea", Icon: PawPrint },
  { keyword: "Homeless", color: "#e11d48", Icon: Home },
];

const DEFAULT_CAUSE: CauseStyle = { color: "#64748b", Icon: HeartHandshake };

// "Education, Youth, Literacy" → ["Education", "Youth", "Literacy"]
export function splitAreas(areas: string): string[] {
  return areas
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// style based on the FIRST listed area
export function getCauseStyle(areas: string): CauseStyle {
  const first = splitAreas(areas)[0] ?? "";
  return CAUSES.find((c) => first.includes(c.keyword)) ?? DEFAULT_CAUSE;
}
