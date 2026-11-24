// ============================================================
// GRUPALES TRAVEL — Tipos y Modelos del Portal Operativo
// ============================================================

export type OperatorRole = "admin" | "operaciones" | "comercial";

export interface OperatorUser {
  id: string;
  username: string;
  name: string;
  email: string;
  passwordHash?: string; // Encriptado o validado internamente
  role: OperatorRole;
  department: string;
  city?: string;
  active: boolean;
  createdAt: string;
}

export type DepartureStatus = "abierta" | "ultimos_cupos" | "cerrada" | "en_viaje" | "finalizada";

export interface DepartureGroup {
  id: string;
  slug: string;
  title: string;
  destinationSlug?: string;
  destinationTitle?: string;
  departureDate: string; // ISO o formato DD/MM/AAAA
  returnDate: string;
  coordinator: string;
  capacity: number; // Cupo total de la salida
  status: DepartureStatus;
  
  // Requisitos especiales
  requiresUsaVisa: boolean;
  requiresYellowFever: boolean;
  specialRequirementsNotes?: string;

  // Rutas terrestres y servicios disponibles para esta salida
  busRoutesAvailable: string[]; // Ej: ["San Luis -> Bs As", "Villa Mercedes -> Bs As", "Córdoba -> Bs As"]
  hotelsPreAvailable: string[]; // Ej: ["Hotel Sheraton Retiro (Bs As)", "Hotel Dazzler Recoleta"]
  hotelsPostAvailable: string[];

  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type RoomType = "single" | "doble_matrimonial" | "doble_twin" | "doble_compartir" | "triple";
export type DocumentType = "DNI" | "Pasaporte" | "Cedula";
export type DocsStatus = "completo" | "incompleto" | "pendiente_pasaporte" | "pendiente_visa" | "pasaporte_por_vencer";

export type PaxDocumentCategory = "dni" | "pasaporte" | "visa" | "vacuna" | "otro";

export interface PaxDocumentItem {
  id: string;
  name: string;
  category: PaxDocumentCategory;
  url: string;
  size?: number;
  uploadedAt: string;
  uploadedBy?: string;
}

export interface PassengerPax {
  id: string;
  departureId: string; // Salida a la que pertenece

  // 1. Datos Personales
  firstName: string; // Exacto como figura en pasaporte/DNI
  lastName: string;  // Exacto como figura en pasaporte/DNI
  documentType: DocumentType;
  documentNumber: string;
  birthDate: string; // DD/MM/AAAA
  gender: "M" | "F" | "X";
  nationality: string;

  // 2. Pasaporte
  passportNumber?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string; // DD/MM/AAAA o YYYY-MM-DD
  
  // 3. Contacto y Localidad
  phone: string;
  email: string;
  city: string;
  province: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;

  // 4. Salud y Alimentación
  medicalNotes?: string; // Celiaquía, vegetariano, hipertensión, etc.

  // 5. Documentación Especial & Almacenamiento en la Nube
  hasUsaVisa?: boolean;
  usaVisaExpiry?: string;
  hasYellowFever?: boolean;
  docsStatus: DocsStatus;
  docAttachmentUrl?: string; // Enlace a foto/PDF principal (retrocompatibilidad)
  docDniUrl?: string; // Enlace directo en la nube a foto o PDF del DNI
  docPassportUrl?: string; // Enlace directo en la nube a foto o PDF del Pasaporte
  docVisaUrl?: string; // Enlace directo en la nube a foto o PDF de la Visa EEUU
  docVaccineUrl?: string; // Enlace directo en la nube a Certificado Fiebre Amarilla
  documents?: PaxDocumentItem[]; // Historial y archivos adjuntos en la nube (R2)

  // 6. Rooming (Habitación)
  roomType: RoomType;
  roomNumber?: string; // Ej: "Habitación 101" o "Room 1"
  roomPartnerId?: string; // ID de su compañero de habitación si aplica
  roomPartnerName?: string; // Nombre cacheado para reportes
  roomSeekingPartner?: boolean; // True si es doble a compartir y aún no tiene compañero asignado

  // 7. Servicios Internos Pre y Post Viaje
  busInbound?: boolean; // Viaja en bus hacia Buenos Aires / punto de salida
  busInboundRoute?: string; // Ej: "San Luis -> Buenos Aires"
  busOutbound?: boolean; // Regreso en bus
  busOutboundRoute?: string;
  hotelPre?: boolean; // Noche de hotel previa
  hotelPreName?: string;
  hotelPreCheckin?: string;
  hotelPost?: boolean; // Noche de hotel posterior
  hotelPostName?: string;
  hotelPostCheckout?: string;
  transferAirportOut?: boolean; // Traslado Terminal/Hotel -> Ezeiza
  transferAirportIn?: boolean;  // Traslado Ezeiza -> Terminal/Hotel
  internalNotes?: string;

  // 8. Auditoría
  createdBy: string; // Nombre del usuario que cargó el pax
  createdAt: string;
  updatedAt: string;
}

// Estructuras de Reportes
export interface RoomAssignment {
  roomNumber: string;
  roomType: RoomType;
  passengers: PassengerPax[];
  status: "completa" | "buscando_companero" | "individual";
}

export interface FlightManifestItem {
  paxId: string;
  lastName: string;
  firstName: string;
  documentType: string;
  documentNumber: string;
  passportNumber: string;
  passportExpiry: string;
  birthDate: string;
  gender: string;
  nationality: string;
}

