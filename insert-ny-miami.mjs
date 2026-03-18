import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://osbogszltteyokksbshk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zYm9nc3psdHRleW9ra3Nic2hrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM5MTA0NCwiZXhwIjoyMDg2OTY3MDQ0fQ.efyidfUCQGKoUziVZTCgsMk_6-ifACf5HqIESKWS_-Y"
);

const itinerary_days = [
  { day: 1,  date: "Jueves 13 de Agosto",       city: "Buenos Aires",              content: "Partida desde el Aeropuerto Internacional de Ezeiza con vuelos de American Airlines con conexión. Noche a bordo." },
  { day: 2,  date: "Viernes 14 de Agosto",      city: "Nueva York",                content: "Llegada al Aeropuerto JFK. Traslado al hotel Sheraton New York Times Square. Tarde libre para los primeros pasos por la ciudad. Alojamiento." },
  { day: 3,  date: "Sábado 15 de Agosto",       city: "Nueva York",                content: "Desayuno en el hotel. City tour panorámico por Nueva York: Times Square, Central Park, el puente de Brooklyn, el barrio de SoHo y el Bajo Manhattan. Tarde y noche libres. Alojamiento." },
  { day: 4,  date: "Domingo 16 de Agosto",      city: "Nueva York",                content: "Desayuno en el hotel. Día libre para explorar la ciudad a tu ritmo: podés visitar los museos, recorrer el High Line, ir de compras en la Quinta Avenida o simplemente disfrutar del ambiente neoyorquino. Alojamiento." },
  { day: 5,  date: "Lunes 17 de Agosto",        city: "Nueva York / Washington D.C.", content: "Desayuno en el hotel. Excursión de día completo a Washington D.C.: la Casa Blanca, el Capitolio, el Lincoln Memorial y el Mall Nacional. Regreso a Nueva York por la noche. Alojamiento." },
  { day: 6,  date: "Martes 18 de Agosto",       city: "Nueva York",                content: "Desayuno en el hotel. Día libre. Última tarde en Nueva York para compras o visitas pendientes. Alojamiento." },
  { day: 7,  date: "Miércoles 19 de Agosto",    city: "Nueva York → Miami",        content: "Desayuno en el hotel. Traslado al Aeropuerto de LaGuardia y vuelo interno a Miami con American Airlines. Llegada y traslado al hotel Riu Plaza Miami Beach. Noche libre en South Beach. Alojamiento." },
  { day: 8,  date: "Jueves 20 de Agosto",       city: "Miami",                     content: "Desayuno en el hotel. City tour por Miami: South Beach con su famosa arquitectura Art Deco, el paseo de Ocean Drive, el barrio de Little Havana y las mansiones de las islas. Tarde libre. Alojamiento." },
  { day: 9,  date: "Viernes 21 de Agosto",      city: "Miami",                     content: "Desayuno en el hotel. Día libre para disfrutar de las playas de arena blanca, el shopping en Aventura Mall o Bayside Marketplace, o simplemente relajarse al sol. Alojamiento." },
  { day: 10, date: "Sábado 22 de Agosto",       city: "Miami",                     content: "Desayuno en el hotel. Día libre. Podés contratar opcionalmente una excursión a los Everglades o a Key West. Última noche en Miami con cena opcional en grupo. Alojamiento." },
  { day: 11, date: "Domingo 23 de Agosto",      city: "Miami",                     content: "Desayuno en el hotel. Mañana libre para las últimas compras o un paseo final por la playa. Tarde: traslado al Aeropuerto Internacional de Miami para el vuelo de regreso. Noche a bordo." },
  { day: 12, date: "Lunes 24 de Agosto",        city: "En vuelo",                  content: "Vuelo de regreso a Buenos Aires con escala. Noche a bordo." },
  { day: 13, date: "Martes 25 de Agosto",       city: "Buenos Aires",              content: "Llegada al Aeropuerto de Ezeiza. ¡Fin del viaje con los mejores recuerdos de Nueva York y Miami!" },
];

const includes = [
  "Coordinador acompañante desde Argentina",
  "Vuelos internacionales con American Airlines",
  "Vuelo interno Nueva York – Miami",
  "Traslados aeropuerto – hotel – aeropuerto",
  "Alojamiento en Sheraton New York Times Square 4★ (5 noches)",
  "Alojamiento en Riu Plaza Miami Beach 4★ (5 noches)",
  "Desayuno incluido en ambos hoteles",
  "City tour panorámico en Nueva York",
  "Excursión a Washington D.C.",
  "City tour en Miami con South Beach y Little Havana",
  "Seguro de asistencia médica internacional",
  "Habitación doble garantizada para viajeros solos",
];

const { data, error } = await supabase.from("destinations").insert({
  slug:             "new-york-miami-2026",
  title:            "New York & Miami",
  tagline:          "De Manhattan a South Beach en una sola salida grupal",
  description:      "Viví una experiencia única recorriendo dos de las ciudades más icónicas de Estados Unidos. Comenzás en Nueva York, con su energía inigualable, Times Square, Central Park y una excursión a Washington D.C. Luego volás a Miami para disfrutar de sus playas de arena blanca, el Art Deco de South Beach, el barrio cubano de Little Havana y los Everglades. Todo acompañado por nuestro coordinador desde Argentina y en un grupo de viajeros que comparten tus ganas de conocer el mundo.",
  region:           "america",
  countries:        1,
  cities:           2,
  days:             13,
  departure_date:   "2026-08-13",
  return_date:      "2026-08-25",
  cover_path:       "portadas/new-york-miami-2026.webp",
  hero_path:        "backgrounds/new-york-miami-2026.webp",
  map_path:         "mapas/new-york-miami-2026.png",
  itinerary_path:   "itinerarios/new-york-miami-2026.pdf",
  whatsapp_url:     "https://wa.me/5491112345678",
  video_urls:       [],
  includes,
  itinerary_days,
  featured:         true,
  active:           true,
}).select();

if (error) {
  console.error("Error inserting destination:", error.message);
} else {
  console.log("Inserted successfully:", data[0].slug, "— id:", data[0].id);
}
