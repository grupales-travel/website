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

export function formatWhatsAppUrl(whatsappUrl: string, destinationTitle: string): string {
  const message = `Hola quiero mas información de ${destinationTitle}!`;
  
  if (!whatsappUrl) return "";
  
  let urlStr = whatsappUrl;
  if (!urlStr.startsWith("http")) {
    urlStr = `https://${urlStr}`;
  }

  try {
    const url = new URL(urlStr);
    url.searchParams.set("text", message);
    return url.toString();
  } catch (e) {
    return `${urlStr}?text=${encodeURIComponent(message)}`;
  }
}
