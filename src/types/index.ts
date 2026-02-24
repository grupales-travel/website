export type Region = "europa" | "america" | "asia" | "africa-mo" | "oceania";

export interface ItineraryDay {
  day: number;
  date: string;   // "Jueves 13 de Agosto"
  city: string;   // "Nueva York"
  content: string;
}

export interface Destination {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  countries: number;
  cities: number;
  days: number;
  departureDate: string;   // "13 Ago – 25 Ago 2026"
  returnDate?: string;
  departureCity?: string;
  year: number;
  region: Region;
  heroImage: string;       // imagen de fondo del hero (landscape)
  thumbnailImage: string;  // imagen de la tarjeta (portrait)
  mapImageUrl?: string;    // mapa del recorrido
  description: string;
  itineraryPdfUrl?: string;
  whatsappUrl: string;
  videoTestimonials?: string[];
  includes?: string[];
  itineraryDays?: ItineraryDay[];
  featured: boolean;
  active: boolean;
  partner?: boolean;
  badge?: string;
}

export interface OfficeInfo {
  city: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  mapsUrl?: string;
}
