import { OfficeInfo } from "@/types";

export const COMPANY = {
  name: "Grupales Travel",
  tagline: "Salidas Grupales Acompañadas",
  description:
    "Somos una agencia de viajes especializada en salidas grupales acompañadas. Desde el 2018 estamos acompañando a nuestros clientes a descubrir el mundo.",
  email: "consultas@grupalestravel.com",
  whatsapp: "https://wa.link/ggzwq4",
  instagram: "https://www.instagram.com/grupalestravel/",
  facebook: "https://www.facebook.com/grupalestravel/",
  founded: 2018,
  license: "EVyT 19182",
  address: "General Paz 560",
} as const;

export const OFFICES: OfficeInfo[] = [
  {
    city: "San Luis",
    phone: "+54 9 266 525-2730",
    whatsapp: "https://wa.me/5492665252730",
    address: "Pringles 335",
    mapsUrl: "https://maps.app.goo.gl/1sh3LZxdtG22muas8",
  },
  {
    city: "Villa Mercedes",
    phone: "+54 9 265 777-3473",
    whatsapp: "https://wa.me/5492657773473",
    address: "General Paz 560",
    mapsUrl: "https://maps.app.goo.gl/mzAafmsanWRdkpEbA",
  },
  {
    city: "Córdoba",
    phone: "+54 9 351 212-3128",
    whatsapp: "https://wa.me/5493512123128",
    address: "La Rioja 590, oficina 14",
    mapsUrl: "https://maps.app.goo.gl/keemdMTUaXw2nwEC8",
  },
];

export const ADVANTAGES = [
  {
    id: "coordinators",
    icon: "users",
    title: "Coordinadores Acompañantes",
    description:
      "Coordinadores de Argentina viajan con cada grupo durante todo el recorrido, atentos a cada detalle para que disfrutes sin preocupaciones.",
  },
  {
    id: "flights",
    icon: "plane",
    title: "Vuelos y Traslados Incluidos",
    description:
      "Vuelos de ida y vuelta con aerolíneas reconocidas y todos los traslados al aeropuerto y entre ciudades incluidos en el precio.",
  },
  {
    id: "hotel",
    icon: "building",
    title: "Alojamiento Seleccionado",
    description:
      "Hoteles de categoría en ubicaciones céntricas, con desayuno diario incluido en cada destino del recorrido.",
  },
  {
    id: "tours",
    icon: "map",
    title: "Excursiones en Español",
    description:
      "Todas las excursiones incluidas son guiadas en español, para que no te pierdas ningún detalle de cada destino.",
  },
  {
    id: "insurance",
    icon: "shield",
    title: "Seguro Médico Incluido",
    description:
      "Asistencia médica completa durante toda la estadía en el exterior, sin costo adicional ni trámites complicados.",
  },
  {
    id: "room",
    icon: "door-open",
    title: "Habitación Doble Garantizada",
    description:
      "Somos una de las pocas agencias que garantiza habitación doble a quienes viajan solos. Sin suplemento por uso individual.",
    featured: true,
  },
  {
    id: "cuotas",
    icon: "credit-card",
    title: "Financiación en Cuotas",
    description:
      "Podés abonar tu viaje en cuotas con tarjeta de crédito. Consultá los planes disponibles con nuestros asesores.",
  },
];
