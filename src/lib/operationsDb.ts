import fs from "fs";
import path from "path";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { DepartureGroup, OperatorUser, PassengerPax } from "@/types/operations";

const BUCKET = process.env.R2_BUCKET || "grupales-travel";
const USERS_KEY = "db/operations_users.json";
const DEPARTURES_KEY = "db/operations_departures.json";
const PASSENGERS_KEY = "db/operations_passengers.json";

// In-memory fallback
let memoryUsers: OperatorUser[] | null = null;
let memoryDepartures: DepartureGroup[] | null = null;
let memoryPassengers: PassengerPax[] | null = null;

// Directorio de persistencia local (evita pérdidas de datos si R2 tiene latencia)
const LOCAL_DATA_DIR = path.join(process.cwd(), ".tmp", "operations");

function ensureLocalDir() {
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
  } catch {}
}

function writeJsonToLocal<T>(filename: string, data: T): void {
  try {
    ensureLocalDir();
    const filePath = path.join(LOCAL_DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`[Local DB] Error escribiendo ${filename}:`, err);
  }
}

function readJsonFromLocal<T>(filename: string): T | null {
  try {
    const filePath = path.join(LOCAL_DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

// ============================================================
// DATOS SEMILLA (INITIAL SEED DATA)
// ============================================================

export const DEFAULT_USERS: OperatorUser[] = [
  {
    id: "usr-matias",
    username: "matias",
    name: "Matías Amoroso",
    email: "matias@grupalestravel.com",
    role: "admin",
    department: "Sistemas & Operaciones (Acceso Total)",
    city: "San Luis",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-andres",
    username: "andres",
    name: "Andrés Arellano",
    email: "andres@grupalestravel.com",
    role: "admin",
    department: "Dirección General",
    city: "San Luis",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-marina",
    username: "marina",
    name: "Marina Mendoza",
    email: "marina@grupalestravel.com",
    role: "admin",
    department: "Dirección General",
    city: "San Luis",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-nicolas",
    username: "nicolas",
    name: "Nicolás Sánchez",
    email: "operaciones@grupalestravel.com",
    role: "operaciones",
    department: "Administración y Operaciones",
    city: "San Luis",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-luz",
    username: "luz",
    name: "Luz Sosa",
    email: "administracion@grupalestravel.com",
    role: "operaciones",
    department: "Administración y Operaciones",
    city: "San Luis",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-abel",
    username: "abel",
    name: "Abel López",
    email: "abel@grupalestravel.com",
    role: "comercial",
    department: "Ventas y Operaciones",
    city: "San Luis",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-ramiro",
    username: "ramiro",
    name: "Ramiro Ferreras Ribes",
    email: "ventas@grupalestravel.com",
    role: "comercial",
    department: "Ventas y Operaciones",
    city: "San Luis",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-patricia",
    username: "patricia",
    name: "Patricia Maluzan",
    email: "patricia@grupalestravel.com",
    role: "comercial",
    department: "Ventas y Operaciones",
    city: "San Luis",
    active: true,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_DEPARTURES: DepartureGroup[] = [
  {
    id: "dep-turquia-dubai-2026",
    slug: "turquia-y-dubai-2026",
    title: "Turquía & Dubái 2026",
    destinationSlug: "turquia-y-dubai-2026",
    destinationTitle: "Turquía & Dubái",
    departureDate: "2026-05-15",
    returnDate: "2026-06-02",
    coordinator: "Nicolás Sánchez",
    capacity: 25,
    status: "ultimos_cupos",
    requiresUsaVisa: false,
    requiresYellowFever: true,
    specialRequirementsNotes: "Fiebre amarilla obligatoria 10 días antes del viaje. Pasaporte con vigencia mínima de 6 meses al regreso.",
    busRoutesAvailable: [
      "San Luis -> Buenos Aires",
      "Villa Mercedes -> Buenos Aires",
      "Córdoba -> Buenos Aires"
    ],
    hotelsPreAvailable: [
      "Hotel Sheraton Libertador (Bs As)",
      "Hotel Dazzler San Martín"
    ],
    hotelsPostAvailable: [
      "Hotel Sheraton Libertador (Bs As)"
    ],
    notes: "Vuelo internacional con Emirates desde Ezeiza. Noche previa incluida para pasajeros del interior.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dep-alma-europea-2026",
    slug: "alma-europea-2026",
    title: "Alma Europea 2026",
    destinationSlug: "alma-europea-2026",
    destinationTitle: "Alma Europea",
    departureDate: "2026-09-10",
    returnDate: "2026-09-30",
    coordinator: "Andrés Arellano",
    capacity: 30,
    status: "abierta",
    requiresUsaVisa: false,
    requiresYellowFever: false,
    specialRequirementsNotes: "Pasaporte con vigencia mínima de 3 meses posteriores a la salida del espacio Schengen.",
    busRoutesAvailable: [
      "San Luis -> Buenos Aires",
      "Villa Mercedes -> Buenos Aires"
    ],
    hotelsPreAvailable: [
      "Hotel Sheraton Libertador (Bs As)"
    ],
    hotelsPostAvailable: [
      "Hotel Sheraton Libertador (Bs As)"
    ],
    notes: "Circuito clásico por Madrid, París, Roma, Venecia y Florencia.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dep-peru-magico-2027",
    slug: "encantos-de-peru-2026",
    title: "Perú Mágico & Machu Picchu 2027",
    destinationSlug: "encantos-de-peru-2026",
    destinationTitle: "Encantos de Perú",
    departureDate: "2027-03-21",
    returnDate: "2027-03-31",
    coordinator: "Alejandro Insaurralde",
    capacity: 22,
    status: "abierta",
    requiresUsaVisa: false,
    requiresYellowFever: false,
    specialRequirementsNotes: "DNI o Pasaporte vigente al momento del viaje.",
    busRoutesAvailable: [
      "San Luis -> Buenos Aires",
      "Villa Mercedes -> Buenos Aires"
    ],
    hotelsPreAvailable: [
      "Hotel Dazzler Recoleta"
    ],
    hotelsPostAvailable: [
      "Hotel Dazzler Recoleta"
    ],
    notes: "Incluye tren Vistadome a Machu Picchu y vuelos internos Lima-Cusco.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_PASSENGERS: PassengerPax[] = [
  {
    id: "pax-1",
    departureId: "dep-turquia-dubai-2026",
    firstName: "Carlos Alberto",
    lastName: "Gómez",
    documentType: "Pasaporte",
    documentNumber: "AAB123456",
    birthDate: "15/06/1965",
    gender: "M",
    nationality: "Argentina",
    passportNumber: "AAB123456",
    passportIssueDate: "10/05/2021",
    passportExpiryDate: "2028-05-10",
    phone: "+54 9 266 412-3456",
    email: "carlos.gomez@gmail.com",
    city: "San Luis Capital",
    province: "San Luis",
    emergencyContactName: "María Gómez (Hija)",
    emergencyContactPhone: "+54 9 266 499-8877",
    emergencyContactRelation: "Hija",
    medicalNotes: "Hipertensión controlada",
    hasYellowFever: true,
    docsStatus: "completo",
    roomType: "doble_compartir",
    roomNumber: "Habitación 201",
    roomPartnerId: "pax-2",
    roomPartnerName: "Roberto Fernández",
    roomSeekingPartner: false,
    busInbound: true,
    busInboundRoute: "San Luis -> Buenos Aires",
    busOutbound: true,
    busOutboundRoute: "Buenos Aires -> San Luis",
    hotelPre: true,
    hotelPreName: "Hotel Sheraton Libertador (Bs As)",
    transferAirportOut: true,
    transferAirportIn: true,
    createdBy: "Ramiro Ferreras",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pax-2",
    departureId: "dep-turquia-dubai-2026",
    firstName: "Roberto",
    lastName: "Fernández",
    documentType: "Pasaporte",
    documentNumber: "AAC654321",
    birthDate: "22/11/1963",
    gender: "M",
    nationality: "Argentina",
    passportNumber: "AAC654321",
    passportIssueDate: "14/02/2022",
    passportExpiryDate: "2029-02-14",
    phone: "+54 9 265 745-6789",
    email: "roberto.fernandez@yahoo.com.ar",
    city: "Villa Mercedes",
    province: "San Luis",
    emergencyContactName: "Lucía Fernández (Esposa)",
    emergencyContactPhone: "+54 9 265 711-2233",
    emergencyContactRelation: "Esposa",
    hasYellowFever: true,
    docsStatus: "completo",
    roomType: "doble_compartir",
    roomNumber: "Habitación 201",
    roomPartnerId: "pax-1",
    roomPartnerName: "Carlos Alberto Gómez",
    roomSeekingPartner: false,
    busInbound: true,
    busInboundRoute: "Villa Mercedes -> Buenos Aires",
    busOutbound: true,
    busOutboundRoute: "Buenos Aires -> Villa Mercedes",
    hotelPre: true,
    hotelPreName: "Hotel Sheraton Libertador (Bs As)",
    transferAirportOut: true,
    transferAirportIn: true,
    createdBy: "Patricia Maluzan",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pax-3",
    departureId: "dep-turquia-dubai-2026",
    firstName: "Susana Beatriz",
    lastName: "Pereyra",
    documentType: "Pasaporte",
    documentNumber: "AAD987654",
    birthDate: "04/09/1958",
    gender: "F",
    nationality: "Argentina",
    passportNumber: "AAD987654",
    passportIssueDate: "12/08/2020",
    passportExpiryDate: "2026-08-12", // Vence a menos de 6 meses (Alerta!)
    phone: "+54 9 11 4567-8901",
    email: "susana.pereyra@hotmail.com",
    city: "CABA",
    province: "Buenos Aires",
    emergencyContactName: "Esteban Pereyra (Hijo)",
    emergencyContactPhone: "+54 9 11 5566-7788",
    emergencyContactRelation: "Hijo",
    medicalNotes: "Menú celíaco en vuelos y hoteles",
    hasYellowFever: false, // Alerta pendiente
    docsStatus: "pasaporte_por_vencer",
    roomType: "doble_compartir",
    roomSeekingPartner: true, // ¡Buscando compañera de habitación!
    busInbound: false,
    busOutbound: false,
    hotelPre: false,
    transferAirportOut: true,
    createdBy: "Silvana Martínez",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pax-4",
    departureId: "dep-turquia-dubai-2026",
    firstName: "Elena Rosa",
    lastName: "Quiroga",
    documentType: "Pasaporte",
    documentNumber: "AAE112233",
    birthDate: "18/03/1960",
    gender: "F",
    nationality: "Argentina",
    passportNumber: "AAE112233",
    passportIssueDate: "10/01/2023",
    passportExpiryDate: "2030-01-10",
    phone: "+54 9 299 433-2211",
    email: "elena.quiroga@gmail.com",
    city: "Neuquén Capital",
    province: "Neuquén",
    emergencyContactName: "Pablo Quiroga (Hermano)",
    emergencyContactPhone: "+54 9 299 411-2233",
    emergencyContactRelation: "Hermano",
    hasYellowFever: true,
    docsStatus: "completo",
    roomType: "doble_compartir",
    roomSeekingPartner: true, // ¡Buscando compañera! Puede emparejarse con Susana
    busInbound: false,
    busOutbound: false,
    hotelPre: true,
    hotelPreName: "Hotel Sheraton Libertador (Bs As)",
    transferAirportOut: true,
    createdBy: "Andrés Méndez",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pax-5",
    departureId: "dep-turquia-dubai-2026",
    firstName: "Miguel Ángel",
    lastName: "Rossi",
    documentType: "Pasaporte",
    documentNumber: "AAF998877",
    birthDate: "05/12/1954",
    gender: "M",
    nationality: "Argentina",
    passportNumber: "AAF998877",
    passportIssueDate: "20/04/2022",
    passportExpiryDate: "2029-04-20",
    phone: "+54 9 266 400-1122",
    email: "miguel.rossi@gmail.com",
    city: "San Luis Capital",
    province: "San Luis",
    emergencyContactName: "Clara Rossi (Hija)",
    emergencyContactPhone: "+54 9 266 488-9900",
    emergencyContactRelation: "Hija",
    hasYellowFever: true,
    docsStatus: "completo",
    roomType: "single",
    roomNumber: "Habitación 301",
    roomSeekingPartner: false,
    busInbound: true,
    busInboundRoute: "San Luis -> Buenos Aires",
    busOutbound: true,
    busOutboundRoute: "Buenos Aires -> San Luis",
    hotelPre: true,
    hotelPreName: "Hotel Sheraton Libertador (Bs As)",
    transferAirportOut: true,
    transferAirportIn: true,
    createdBy: "Abel López",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ============================================================
// FUNCIONES R2 STORAGE
// ============================================================

async function readJsonFromR2<T>(key: string): Promise<T | null> {
  try {
    const res = await r2.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );
    if (!res.Body) return null;
    const text = await res.Body.transformToString();
    return JSON.parse(text) as T;
  } catch (err: unknown) {
    const code = (err as { name?: string; code?: string })?.name || (err as { name?: string; code?: string })?.code;
    if (code === "NoSuchKey" || code === "NotFound") {
      return null;
    }
    console.error(`[R2 Operations] Error leyendo ${key}:`, err);
    return null;
  }
}

async function writeJsonToR2<T>(key: string, data: T): Promise<boolean> {
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    await r2.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: Buffer.from(jsonStr, "utf-8"),
        ContentType: "application/json",
        CacheControl: "no-cache",
      })
    );
    return true;
  } catch (err) {
    console.error(`[R2 Operations] Error guardando ${key}:`, err);
    return false;
  }
}

// ============================================================
// MÉTODOS CRUD: USUARIOS OPERATIVOS
// ============================================================

export async function getOperationalUsers(): Promise<OperatorUser[]> {
  const fromR2 = await readJsonFromR2<OperatorUser[]>(USERS_KEY);
  if (fromR2 && fromR2.length > 0 && fromR2.some((u) => u.username === "matias")) {
    memoryUsers = fromR2;
    writeJsonToLocal("users.json", fromR2);
    return fromR2;
  }

  const fromLocal = readJsonFromLocal<OperatorUser[]>("users.json");
  if (fromLocal && fromLocal.length > 0 && fromLocal.some((u) => u.username === "matias")) {
    memoryUsers = fromLocal;
    return fromLocal;
  }

  if (memoryUsers && memoryUsers.some((u) => u.username === "matias")) return memoryUsers;

  // Sincronizar en R2 y local con la lista oficial autorizada
  memoryUsers = DEFAULT_USERS;
  await writeJsonToR2(USERS_KEY, DEFAULT_USERS);
  writeJsonToLocal("users.json", DEFAULT_USERS);
  return DEFAULT_USERS;
}

export async function findUserByUsername(username: string): Promise<OperatorUser | null> {
  const users = await getOperationalUsers();
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.active) || null;
}

// ============================================================
// MÉTODOS CRUD: SALIDAS GRUPALES
// ============================================================

export async function getDepartures(): Promise<DepartureGroup[]> {
  // 1. Intentar R2
  const fromR2 = await readJsonFromR2<DepartureGroup[]>(DEPARTURES_KEY);
  if (fromR2 && fromR2.length > 0) {
    memoryDepartures = fromR2;
    writeJsonToLocal("departures.json", fromR2);
    return fromR2;
  }

  // 2. Intentar local
  const fromLocal = readJsonFromLocal<DepartureGroup[]>("departures.json");
  if (fromLocal && fromLocal.length > 0) {
    memoryDepartures = fromLocal;
    return fromLocal;
  }

  // 3. Fallback en memoria si ya fue modificado
  if (memoryDepartures && memoryDepartures.length > 0) {
    return memoryDepartures;
  }

  // 4. Semilla por defecto
  memoryDepartures = DEFAULT_DEPARTURES;
  await writeJsonToR2(DEPARTURES_KEY, DEFAULT_DEPARTURES);
  writeJsonToLocal("departures.json", DEFAULT_DEPARTURES);
  return DEFAULT_DEPARTURES;
}

export async function getDepartureById(id: string): Promise<DepartureGroup | null> {
  const departures = await getDepartures();
  return departures.find((d) => d.id === id) || null;
}

export async function saveDeparture(departure: DepartureGroup): Promise<DepartureGroup> {
  const departures = await getDepartures();
  const index = departures.findIndex((d) => d.id === departure.id);
  const now = new Date().toISOString();

  let savedItem: DepartureGroup;
  if (index >= 0) {
    savedItem = { ...departures[index], ...departure, updatedAt: now };
    departures[index] = savedItem;
  } else {
    savedItem = {
      ...departure,
      createdAt: departure.createdAt || now,
      updatedAt: now,
    };
    departures.unshift(savedItem);
  }

  memoryDepartures = departures;
  await writeJsonToR2(DEPARTURES_KEY, departures);
  writeJsonToLocal("departures.json", departures);

  return savedItem;
}

export async function deleteDeparture(id: string): Promise<boolean> {
  const departures = await getDepartures();
  const filtered = departures.filter((d) => d.id !== id);
  memoryDepartures = filtered;
  await writeJsonToR2(DEPARTURES_KEY, filtered);
  writeJsonToLocal("departures.json", filtered);
  return true;
}

// ============================================================
// MÉTODOS CRUD: PASAJEROS (PAX)
// ============================================================

export async function getPassengers(): Promise<PassengerPax[]> {
  // 1. Intentar R2
  const fromR2 = await readJsonFromR2<PassengerPax[]>(PASSENGERS_KEY);
  if (fromR2 && fromR2.length > 0) {
    memoryPassengers = fromR2;
    writeJsonToLocal("passengers.json", fromR2);
    return fromR2;
  }

  // 2. Intentar local
  const fromLocal = readJsonFromLocal<PassengerPax[]>("passengers.json");
  if (fromLocal && fromLocal.length > 0) {
    memoryPassengers = fromLocal;
    return fromLocal;
  }

  // 3. Fallback en memoria si ya fue modificado
  if (memoryPassengers && memoryPassengers.length > 0) {
    return memoryPassengers;
  }

  // 4. Semilla por defecto
  memoryPassengers = DEFAULT_PASSENGERS;
  await writeJsonToR2(PASSENGERS_KEY, DEFAULT_PASSENGERS);
  writeJsonToLocal("passengers.json", DEFAULT_PASSENGERS);
  return DEFAULT_PASSENGERS;
}

export async function getPassengersByDeparture(departureId: string): Promise<PassengerPax[]> {
  const all = await getPassengers();
  return all.filter((p) => p.departureId === departureId);
}

export async function savePassenger(pax: PassengerPax): Promise<PassengerPax> {
  const passengers = await getPassengers();
  const index = passengers.findIndex((p) => p.id === pax.id);
  const now = new Date().toISOString();

  // Cálculo automático del estado de documentación
  let docsStatus = pax.docsStatus;
  if (pax.passportExpiryDate) {
    const expDate = new Date(pax.passportExpiryDate);
    const sixMonthsAhead = new Date();
    sixMonthsAhead.setMonth(sixMonthsAhead.getMonth() + 6);
    if (expDate < sixMonthsAhead) {
      docsStatus = "pasaporte_por_vencer";
    }
  }

  let updatedPax: PassengerPax;
  if (index >= 0) {
    updatedPax = {
      ...passengers[index],
      ...pax,
      docsStatus,
      updatedAt: now,
    };
    passengers[index] = updatedPax;
  } else {
    updatedPax = {
      ...pax,
      docsStatus,
      createdAt: pax.createdAt || now,
      updatedAt: now,
    };
    passengers.unshift(updatedPax);
  }

  memoryPassengers = passengers;
  await writeJsonToR2(PASSENGERS_KEY, passengers);
  writeJsonToLocal("passengers.json", passengers);

  return updatedPax;
}

export async function deletePassenger(id: string): Promise<boolean> {
  const passengers = await getPassengers();
  // Si compartía habitación con alguien, desemparejar al otro
  const toDelete = passengers.find((p) => p.id === id);
  if (toDelete?.roomPartnerId) {
    const partner = passengers.find((p) => p.id === toDelete.roomPartnerId);
    if (partner) {
      partner.roomPartnerId = undefined;
      partner.roomPartnerName = undefined;
      partner.roomSeekingPartner = partner.roomType === "doble_compartir";
    }
  }

  const filtered = passengers.filter((p) => p.id !== id);
  memoryPassengers = filtered;
  await writeJsonToR2(PASSENGERS_KEY, filtered);
  writeJsonToLocal("passengers.json", filtered);
  return true;
}

// ============================================================
// ROOMING INTELIGENTE: EMPAREJAMIENTO DE HABITACIÓN
// ============================================================

export async function assignRoomPair(
  pax1Id: string,
  pax2Id: string,
  roomNumber: string
): Promise<boolean> {
  const passengers = await getPassengers();
  const pax1 = passengers.find((p) => p.id === pax1Id);
  const pax2 = passengers.find((p) => p.id === pax2Id);

  if (!pax1 || !pax2) return false;

  pax1.roomNumber = roomNumber;
  pax1.roomPartnerId = pax2.id;
  pax1.roomPartnerName = `${pax2.lastName}, ${pax2.firstName}`;
  pax1.roomSeekingPartner = false;

  pax2.roomNumber = roomNumber;
  pax2.roomPartnerId = pax1.id;
  pax2.roomPartnerName = `${pax1.lastName}, ${pax1.firstName}`;
  pax2.roomSeekingPartner = false;

  memoryPassengers = passengers;
  return await writeJsonToR2(PASSENGERS_KEY, passengers);
}

export async function unpairRoom(paxId: string): Promise<boolean> {
  const passengers = await getPassengers();
  const pax = passengers.find((p) => p.id === paxId);
  if (!pax) return false;

  if (pax.roomPartnerId) {
    const partner = passengers.find((p) => p.id === pax.roomPartnerId);
    if (partner) {
      partner.roomPartnerId = undefined;
      partner.roomPartnerName = undefined;
      partner.roomSeekingPartner = partner.roomType === "doble_compartir";
    }
  }

  pax.roomPartnerId = undefined;
  pax.roomPartnerName = undefined;
  pax.roomSeekingPartner = pax.roomType === "doble_compartir";

  memoryPassengers = passengers;
  return await writeJsonToR2(PASSENGERS_KEY, passengers);
}

