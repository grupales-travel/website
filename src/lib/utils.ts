import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs
    .filter(Boolean)
    .map((c) => String(c))
    .join(" ");
}

export function formatRegion(region: string): string {
  const map: Record<string, string> = {
    europa: "Europa",
    america: "América",
    asia: "Asia",
    "africa-mo": "África y Medio Oriente",
    oceania: "Oceanía",
  };
  return map[region] ?? region;
}
