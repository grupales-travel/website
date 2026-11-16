"use client";

import { useState, useEffect } from "react";
import { DepartureGroup, OperatorUser, PassengerPax, RoomType } from "@/types/operations";
import { X, Save, AlertTriangle, User, BedDouble, Bus, Phone, ShieldAlert, Check } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pax: PassengerPax) => void;
  passenger: PassengerPax | null;
  departures: DepartureGroup[];
  allPassengers: PassengerPax[];
  currentUser: OperatorUser | null;
}

export default function PassengerModal({
  isOpen,
  onClose,
  onSave,
  passenger,
  departures,
  allPassengers,
  currentUser,
}: Props) {
  const [activeTab, setActiveTab] = useState<"personal" | "rooming" | "logistica" | "contacto">("personal");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Estado del formulario
  const [formData, setFormData] = useState<Partial<PassengerPax>>({
    departureId: departures[0]?.id || "",
    firstName: "",
    lastName: "",
    documentType: "Pasaporte",
    documentNumber: "",
    birthDate: "",
    gender: "M",
    nationality: "Argentina",
    passportNumber: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    phone: "",
    email: "",
    city: "",
    province: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    medicalNotes: "",
    hasUsaVisa: false,
    hasYellowFever: false,
    docsStatus: "incompleto",
    roomType: "doble_compartir",
    roomNumber: "",
    roomPartnerId: "",
    roomSeekingPartner: true,
    busInbound: false,
    busInboundRoute: "San Luis -> Buenos Aires",
    busOutbound: false,
    busOutboundRoute: "Buenos Aires -> San Luis",
    hotelPre: false,
    hotelPreName: "Hotel Sheraton Libertador (Bs As)",
    transferAirportOut: false,
    transferAirportIn: false,
    internalNotes: "",
  });

  useEffect(() => {
    if (passenger) {
      setFormData(passenger);
    } else {
      setFormData({
        id: `pax-${Date.now()}`,
        departureId: departures[0]?.id || "",
        firstName: "",
        lastName: "",
        documentType: "Pasaporte",
        documentNumber: "",
        birthDate: "",
        gender: "M",
        nationality: "Argentina",
        docsStatus: "incompleto",
        roomType: "doble_compartir",
        roomSeekingPartner: true,
        busInbound: false,
        busInboundRoute: "San Luis -> Buenos Aires",
        busOutbound: false,
        busOutboundRoute: "Buenos Aires -> San Luis",
        hotelPre: false,
        hotelPreName: "Hotel Sheraton Libertador (Bs As)",
        transferAirportOut: false,
        transferAirportIn: false,
      });
    }
  }, [passenger, departures]);

  if (!isOpen) return null;

  // Pasajeros disponibles de la misma salida para emparejar en Doble a Compartir
  const availablePartners = allPassengers.filter(
    (p) =>
      p.departureId === formData.departureId &&
      p.id !== formData.id &&
      p.roomType === "doble_compartir" &&
      (!p.roomPartnerId || p.roomPartnerId === formData.id)
  );

  // Alerta de vigencia de pasaporte (< 6 meses)
  const isPassportExpiringSoon = () => {
    if (!formData.passportExpiryDate) return false;
    const exp = new Date(formData.passportExpiryDate);
    const selectedDep = departures.find((d) => d.id === formData.departureId);
    const depDate = selectedDep?.departureDate ? new Date(selectedDep.departureDate) : new Date();
    depDate.setMonth(depDate.getMonth() + 6);
    return exp < depDate;
  };

  const handleChange = (field: keyof PassengerPax, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      
      // Si cambia el tipo de habitación
      if (field === "roomType") {
        if (value === "doble_compartir") {
          next.roomSeekingPartner = !next.roomPartnerId;
        } else {
          next.roomSeekingPartner = false;
          next.roomPartnerId = undefined;
          next.roomPartnerName = undefined;
        }
      }

      // Si selecciona un compañero
      if (field === "roomPartnerId") {
        if (value) {
          const partner = allPassengers.find((p) => p.id === value);
          next.roomPartnerName = partner ? `${partner.lastName}, ${partner.firstName}` : "";
          next.roomSeekingPartner = false;
        } else {
          next.roomPartnerName = "";
          next.roomSeekingPartner = next.roomType === "doble_compartir";
        }
      }

      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.firstName || !formData.lastName || !formData.departureId) {
      setError("Por favor completa los nombres, apellidos y la salida grupal.");
      return;
    }

    setSaving(true);
    try {
      const payload: PassengerPax = {
        id: formData.id || `pax-${Date.now()}`,
        departureId: formData.departureId!,
        firstName: formData.firstName.trim().toUpperCase(),
        lastName: formData.lastName.trim().toUpperCase(),
        documentType: formData.documentType || "Pasaporte",
        documentNumber: formData.documentNumber?.trim() || "",
        birthDate: formData.birthDate || "",
        gender: formData.gender || "M",
        nationality: formData.nationality || "Argentina",
        passportNumber: formData.passportNumber?.trim().toUpperCase(),
        passportIssueDate: formData.passportIssueDate || "",
        passportExpiryDate: formData.passportExpiryDate || "",
        phone: formData.phone || "",
        email: formData.email || "",
        city: formData.city || "",
        province: formData.province || "",
        emergencyContactName: formData.emergencyContactName || "",
        emergencyContactPhone: formData.emergencyContactPhone || "",
        emergencyContactRelation: formData.emergencyContactRelation || "",
        medicalNotes: formData.medicalNotes || "",
        hasUsaVisa: Boolean(formData.hasUsaVisa),
        usaVisaExpiry: formData.usaVisaExpiry || "",
        hasYellowFever: Boolean(formData.hasYellowFever),
        docsStatus: isPassportExpiringSoon() ? "pasaporte_por_vencer" : "completo",
        roomType: formData.roomType || "doble_compartir",
        roomNumber: formData.roomNumber || "",
        roomPartnerId: formData.roomPartnerId || undefined,
        roomPartnerName: formData.roomPartnerName || undefined,
        roomSeekingPartner: Boolean(formData.roomSeekingPartner),
        busInbound: Boolean(formData.busInbound),
        busInboundRoute: formData.busInboundRoute || "",
        busOutbound: Boolean(formData.busOutbound),
        busOutboundRoute: formData.busOutboundRoute || "",
        hotelPre: Boolean(formData.hotelPre),
        hotelPreName: formData.hotelPreName || "",
        transferAirportOut: Boolean(formData.transferAirportOut),
        transferAirportIn: Boolean(formData.transferAirportIn),
        internalNotes: formData.internalNotes || "",
        createdBy: formData.createdBy || currentUser?.name || "Operaciones",
        createdAt: formData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch("/api/operaciones/pasajeros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al guardar pasajero");
      }

      const saved = await res.json();
      onSave(saved);
    } catch (err: any) {
      setError(err.message || "Error al conectar con la base de datos");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#1b2027] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Cabecera del Modal */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#222832]/80">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#dfb44f]">
              Ficha Operativa de Pasajero
            </span>
            <h2 className="text-lg font-black uppercase text-white tracking-tight">
              {passenger ? `Editar: ${passenger.lastName}, ${passenger.firstName}` : "Cargar Nuevo Pasajero"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Pestañas de Navegación del Formulario */}
        <div className="flex border-b border-white/10 bg-[#171b21] px-4 gap-2 overflow-x-auto text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "personal"
                ? "border-[#ba8728] text-[#dfb44f]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <User size={15} />
            Datos & Pasaporte
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("rooming")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "rooming"
                ? "border-[#ba8728] text-[#dfb44f]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <BedDouble size={15} />
            Rooming & Habitación
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("logistica")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "logistica"
                ? "border-[#ba8728] text-[#dfb44f]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Bus size={15} />
            Servicios Pre/Post
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contacto")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "contacto"
                ? "border-[#ba8728] text-[#dfb44f]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Phone size={15} />
            Contacto & Salud
          </button>
        </div>

        {/* Alerta de Error si hay */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* ═══════════ PESTAÑA 1: DATOS PERSONALES & PASAPORTE ═══════════ */}
          {activeTab === "personal" && (
            <div className="space-y-5">
              {/* Salida Grupal */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#dfb44f] mb-1.5">
                  Salida Grupal Asignada *
                </label>
                <select
                  value={formData.departureId}
                  onChange={(e) => handleChange("departureId", e.target.value)}
                  className="w-full bg-[#14181d] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ba8728]"
                  required
                >
                  {departures.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} ({d.departureDate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Apellidos (según documento) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: GÓMEZ"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className="w-full bg-[#14181d] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white uppercase placeholder:text-white/30 focus:outline-none focus:border-[#ba8728]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Nombres (según documento) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: CARLOS ALBERTO"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="w-full bg-[#14181d] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white uppercase placeholder:text-white/30 focus:outline-none focus:border-[#ba8728]"
                  />
                </div>
              </div>

              {/* Documento y Nacimiento */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Tipo Doc.
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => handleChange("documentType", e.target.value)}
                    className="w-full bg-[#14181d] border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ba8728]"
                  >
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="DNI">DNI</option>
                    <option value="Cedula">Cédula</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Nº Documento / DNI
                  </label>
                  <input
                    type="text"
                    placeholder="12.345.678"
                    value={formData.documentNumber}
                    onChange={(e) => handleChange("documentNumber", e.target.value)}
                    className="w-full bg-[#14181d] border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ba8728]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    F. Nacimiento (DD/MM/AAAA)
                  </label>
                  <input
                    type="text"
                    placeholder="15/06/1965"
                    value={formData.birthDate}
                    onChange={(e) => handleChange("birthDate", e.target.value)}
                    className="w-full bg-[#14181d] border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ba8728]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Género
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="w-full bg-[#14181d] border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ba8728]"
                  >
                    <option value="M">Masculino (M)</option>
                    <option value="F">Femenino (F)</option>
                    <option value="X">Otro (X)</option>
                  </select>
                </div>
              </div>

              {/* Sección Pasaporte con Semáforo */}
              <div className="p-4 rounded-2xl bg-[#14181d] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#dfb44f]">
                    Datos de Pasaporte para Aéreos
                  </h4>
                  {isPassportExpiringSoon() && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold uppercase tracking-wider border border-red-500/40 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Vence a menos de 6 meses
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-white/60 mb-1">
                      Nº Pasaporte
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: AAB123456"
                      value={formData.passportNumber}
                      onChange={(e) => handleChange("passportNumber", e.target.value)}
                      className="w-full bg-[#1b2027] border border-white/15 rounded-xl px-3 py-2 text-sm text-white uppercase placeholder:text-white/30 focus:outline-none focus:border-[#ba8728]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-white/60 mb-1">
                      Fecha de Emisión
                    </label>
                    <input
                      type="date"
                      value={formData.passportIssueDate}
                      onChange={(e) => handleChange("passportIssueDate", e.target.value)}
                      className="w-full bg-[#1b2027] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ba8728]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-white/60 mb-1">
                      Fecha de Vencimiento
                    </label>
                    <input
                      type="date"
                      value={formData.passportExpiryDate}
                      onChange={(e) => handleChange("passportExpiryDate", e.target.value)}
                      className={`w-full bg-[#1b2027] border rounded-xl px-3 py-2 text-sm text-white focus:outline-none ${
                        isPassportExpiringSoon()
                          ? "border-red-500/80 ring-1 ring-red-500"
                          : "border-white/15 focus:border-[#ba8728]"
                      }`}
                    />
                  </div>
                </div>

                {isPassportExpiringSoon() && (
                  <p className="text-xs text-red-300 flex items-center gap-1.5 pt-1">
                    <ShieldAlert size={14} className="shrink-0" />
                    <strong>Alerta de Seguridad:</strong> La aerolínea o migraciones pueden rechazar el embarque si el pasaporte tiene menos de 6 meses de vigencia al momento del viaje.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ═══════════ PESTAÑA 2: ROOMING & HABITACIÓN ═══════════ */}
          {activeTab === "rooming" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#dfb44f] mb-2">
                  Tipo de Habitación Contratada *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "doble_compartir", label: "Doble a Compartir", desc: "Viaja solo/a, busca comp." },
                    { id: "single", label: "Single (Individual)", desc: "Habitación privada" },
                    { id: "doble_matrimonial", label: "Doble Matrimonial", desc: "Cama matrimonial" },
                    { id: "doble_twin", label: "Doble Twin", desc: "2 camas separadas" },
                    { id: "triple", label: "Triple", desc: "3 camas" },
                  ].map((room) => (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => handleChange("roomType", room.id as RoomType)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        formData.roomType === room.id
                          ? "bg-[#ba8728]/20 border-[#ba8728] text-white ring-1 ring-[#ba8728]"
                          : "bg-[#14181d] border-white/10 text-white/70 hover:border-white/30"
                      }`}
                    >
                      <p className="text-xs font-black uppercase">{room.label}</p>
                      <p className="text-[10px] text-white/50 mt-0.5 leading-snug">{room.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lógica de Doble a Compartir */}
              {formData.roomType === "doble_compartir" && (
                <div className="p-5 rounded-2xl bg-[#14181d] border border-amber-500/30 space-y-4">
                  <div className="flex items-center gap-2">
                    <BedDouble size={18} className="text-amber-400" />
                    <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider">
                      Emparejamiento de Habitación a Compartir
                    </h4>
                  </div>

                  <p className="text-xs text-white/70">
                    Podés seleccionar inmediatamente otro pasajero de esta salida para compartir, o dejarlo como libre en búsqueda de acompañante.
                  </p>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="seekingPartner"
                        checked={formData.roomSeekingPartner}
                        onChange={() => {
                          handleChange("roomSeekingPartner", true);
                          handleChange("roomPartnerId", "");
                        }}
                        className="text-[#ba8728] focus:ring-[#ba8728]"
                      />
                      <span className="text-xs font-bold text-white">
                        Dejar en estado: &quot;Buscando compañero/a de habitación&quot;
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="seekingPartner"
                        checked={!formData.roomSeekingPartner}
                        onChange={() => handleChange("roomSeekingPartner", false)}
                        className="text-[#ba8728] focus:ring-[#ba8728]"
                      />
                      <span className="text-xs font-bold text-white">
                        Asignar y emparejar con un compañero ahora:
                      </span>
                    </label>

                    {!formData.roomSeekingPartner && (
                      <div className="pt-2 pl-6">
                        <select
                          value={formData.roomPartnerId || ""}
                          onChange={(e) => handleChange("roomPartnerId", e.target.value)}
                          className="w-full bg-[#1b2027] border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ba8728]"
                        >
                          <option value="">-- Seleccionar pasajero para emparejar --</option>
                          {availablePartners.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.lastName}, {p.firstName} ({p.gender} · {p.city})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Número de Habitación */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Número / Identificador de Habitación (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Habitación 201"
                  value={formData.roomNumber}
                  onChange={(e) => handleChange("roomNumber", e.target.value)}
                  className="w-full bg-[#14181d] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ba8728]"
                />
              </div>
            </div>
          )}

          {/* ═══════════ PESTAÑA 3: SERVICIOS PRE Y POST VIAJE ═══════════ */}
          {activeTab === "logistica" && (
            <div className="space-y-5">
              <p className="text-xs text-white/60">
                Marcá los servicios internos contratados por este pasajero para que el sistema complete automáticamente las planillas para choferes, hoteles y coordinadores.
              </p>

              {/* Tramos de Bus */}
              <div className="p-4 rounded-2xl bg-[#14181d] border border-white/10 space-y-3">
                <h4 className="text-xs font-black uppercase text-[#dfb44f] tracking-wider">
                  Traslados Terrestres (Bus Larga Distancia)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.busInbound}
                        onChange={(e) => handleChange("busInbound", e.target.checked)}
                        className="rounded text-[#ba8728] focus:ring-[#ba8728]"
                      />
                      <span className="text-xs font-bold text-white">Requiere Bus IDA a Buenos Aires</span>
                    </label>
                    {formData.busInbound && (
                      <input
                        type="text"
                        value={formData.busInboundRoute}
                        onChange={(e) => handleChange("busInboundRoute", e.target.value)}
                        placeholder="Ej: San Luis -> Buenos Aires"
                        className="w-full bg-[#1b2027] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.busOutbound}
                        onChange={(e) => handleChange("busOutbound", e.target.checked)}
                        className="rounded text-[#ba8728] focus:ring-[#ba8728]"
                      />
                      <span className="text-xs font-bold text-white">Requiere Bus REGRESO desde Bs As</span>
                    </label>
                    {formData.busOutbound && (
                      <input
                        type="text"
                        value={formData.busOutboundRoute}
                        onChange={(e) => handleChange("busOutboundRoute", e.target.value)}
                        placeholder="Ej: Buenos Aires -> San Luis"
                        className="w-full bg-[#1b2027] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Hotelería Pre/Post Circuito */}
              <div className="p-4 rounded-2xl bg-[#14181d] border border-white/10 space-y-3">
                <h4 className="text-xs font-black uppercase text-[#dfb44f] tracking-wider">
                  Hotelería Pre y Post en Buenos Aires / Punto de Partida
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hotelPre}
                        onChange={(e) => handleChange("hotelPre", e.target.checked)}
                        className="rounded text-[#ba8728] focus:ring-[#ba8728]"
                      />
                      <span className="text-xs font-bold text-white">Noche de Hotel Pre-Circuito</span>
                    </label>
                    {formData.hotelPre && (
                      <input
                        type="text"
                        value={formData.hotelPreName}
                        onChange={(e) => handleChange("hotelPreName", e.target.value)}
                        placeholder="Hotel Sheraton Bs As"
                        className="w-full bg-[#1b2027] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hotelPost}
                        onChange={(e) => handleChange("hotelPost", e.target.checked)}
                        className="rounded text-[#ba8728] focus:ring-[#ba8728]"
                      />
                      <span className="text-xs font-bold text-white">Noche de Hotel Post-Circuito</span>
                    </label>
                    {formData.hotelPost && (
                      <input
                        type="text"
                        value={formData.hotelPostName}
                        onChange={(e) => handleChange("hotelPostName", e.target.value)}
                        placeholder="Hotel Sheraton Bs As"
                        className="w-full bg-[#1b2027] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Traslados Aeropuerto */}
              <div className="p-4 rounded-2xl bg-[#14181d] border border-white/10 space-y-2">
                <h4 className="text-xs font-black uppercase text-[#dfb44f] tracking-wider">
                  Traslados a Ezeiza / Aeroparque
                </h4>
                <div className="flex flex-wrap gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.transferAirportOut}
                      onChange={(e) => handleChange("transferAirportOut", e.target.checked)}
                      className="rounded text-[#ba8728] focus:ring-[#ba8728]"
                    />
                    <span className="text-xs font-bold text-white">Traslado Terminal/Hotel -&gt; Ezeiza</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.transferAirportIn}
                      onChange={(e) => handleChange("transferAirportIn", e.target.checked)}
                      className="rounded text-[#ba8728] focus:ring-[#ba8728]"
                    />
                    <span className="text-xs font-bold text-white">Traslado Ezeiza -&gt; Terminal/Hotel</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ PESTAÑA 4: CONTACTO, SALUD Y VISAS ═══════════ */}
          {activeTab === "contacto" && (
            <div className="space-y-5">
              {/* Teléfono, Email y Residencia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    placeholder="+54 9 266 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full bg-[#14181d] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ba8728]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="pasajero@correo.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full bg-[#14181d] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ba8728]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Ciudad de Residencia
                  </label>
                  <input
                    type="text"
                    placeholder="San Luis Capital"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="w-full bg-[#14181d] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ba8728]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Provincia
                  </label>
                  <input
                    type="text"
                    placeholder="San Luis / Buenos Aires / Neuquén..."
                    value={formData.province}
                    onChange={(e) => handleChange("province", e.target.value)}
                    className="w-full bg-[#14181d] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ba8728]"
                  />
                </div>
              </div>

              {/* Contacto de Emergencia */}
              <div className="p-4 rounded-2xl bg-[#14181d] border border-white/10 space-y-3">
                <h4 className="text-xs font-black uppercase text-[#dfb44f] tracking-wider">
                  Contacto de Emergencia en Argentina
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-white/60 mb-1">Nombre</label>
                    <input
                      type="text"
                      placeholder="María Gómez"
                      value={formData.emergencyContactName}
                      onChange={(e) => handleChange("emergencyContactName", e.target.value)}
                      className="w-full bg-[#1b2027] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-white/60 mb-1">Parentesco</label>
                    <input
                      type="text"
                      placeholder="Hija / Esposo / Hermano"
                      value={formData.emergencyContactRelation}
                      onChange={(e) => handleChange("emergencyContactRelation", e.target.value)}
                      className="w-full bg-[#1b2027] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-white/60 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      placeholder="+54 9 266 499-8877"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => handleChange("emergencyContactPhone", e.target.value)}
                      className="w-full bg-[#1b2027] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Salud y Requisitos Médicos / Especiales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Observaciones Médicas / Menú Especial
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ej: Celíaco, menú vegetariano, hipertensión, requiere asistencia de movilidad..."
                    value={formData.medicalNotes}
                    onChange={(e) => handleChange("medicalNotes", e.target.value)}
                    className="w-full bg-[#14181d] border border-white/15 rounded-xl px-4 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ba8728] resize-none"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasYellowFever}
                      onChange={(e) => handleChange("hasYellowFever", e.target.checked)}
                      className="rounded text-[#ba8728] focus:ring-[#ba8728]"
                    />
                    <span className="text-xs font-bold text-white">Vacuna Fiebre Amarilla certificada</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasUsaVisa}
                      onChange={(e) => handleChange("hasUsaVisa", e.target.checked)}
                      className="rounded text-[#ba8728] focus:ring-[#ba8728]"
                    />
                    <span className="text-xs font-bold text-white">Posee Visa de Estados Unidos vigente</span>
                  </label>

                  <div>
                    <label className="block text-[11px] font-semibold text-white/60 mb-1">
                      Notas Internas del Asesor
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Pagó seña con transferencia, resta enviar pasaporte escaneado..."
                      value={formData.internalNotes}
                      onChange={(e) => handleChange("internalNotes", e.target.value)}
                      className="w-full bg-[#14181d] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ba8728] to-[#dfb44f] hover:opacity-95 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#ba8728]/25 disabled:opacity-50 cursor-pointer"
            >
              <Save size={15} />
              {saving ? "Guardando en la Nube..." : "Guardar Pasajero"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

