"use client";

import { useState } from "react";
import Link from "next/link";
import { DepartureGroup, OperatorUser, PassengerPax, RoomType } from "@/types/operations";
import {
  Compass,
  Users2,
  BedDouble,
  PlaneTakeoff,
  Bus,
  Plus,
  ArrowLeft,
  Calendar,
  UserCheck,
  Search,
  Copy,
  Download,
  AlertTriangle,
  Edit,
  Trash2,
  CheckCircle2,
  Printer,
  Sparkles,
  Link as LinkIcon,
  Unlink,
} from "lucide-react";
import PassengerModal from "./PassengerModal";

interface Props {
  user: OperatorUser | null;
  departure: DepartureGroup;
  initialPassengers: PassengerPax[];
  allDepartures: DepartureGroup[];
  allPassengers: PassengerPax[];
  initialTab?: string;
}

export default function DepartureDetailClient({
  user,
  departure,
  initialPassengers,
  allDepartures,
  allPassengers,
  initialTab = "pasajeros",
}: Props) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [passengers, setPassengers] = useState<PassengerPax[]>(initialPassengers);
  const [search, setSearch] = useState("");
  const [isPaxModalOpen, setIsPaxModalOpen] = useState(false);
  const [editingPax, setEditingPax] = useState<PassengerPax | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Filtrado de pasajeros
  const filteredPax = passengers.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.lastName.toLowerCase().includes(q) ||
      p.firstName.toLowerCase().includes(q) ||
      p.documentNumber.includes(q) ||
      (p.passportNumber && p.passportNumber.toLowerCase().includes(q)) ||
      p.city.toLowerCase().includes(q)
    );
  });

  const handlePaxSaved = (saved: PassengerPax) => {
    setPassengers((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    setIsPaxModalOpen(false);
    setEditingPax(null);
  };

  const handlePaxDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar al pasajero ${name} de esta salida?`)) return;

    try {
      const res = await fetch(`/api/operaciones/pasajeros?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPassengers((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("No se pudo eliminar el pasajero.");
      }
    } catch {
      alert("Error al conectar con el servidor.");
    }
  };

  // Emparejar dos pasajeros en Doble a Compartir
  const handlePairRoom = async (pax1Id: string, pax2Id: string) => {
    if (!pax2Id) return;
    try {
      const res = await fetch("/api/operaciones/rooming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pair", pax1Id, pax2Id }),
      });

      if (res.ok) {
        const p1 = passengers.find((p) => p.id === pax1Id);
        const p2 = passengers.find((p) => p.id === pax2Id);
        if (p1 && p2) {
          setPassengers((prev) =>
            prev.map((p) => {
              if (p.id === pax1Id) {
                return {
                  ...p,
                  roomPartnerId: p2.id,
                  roomPartnerName: `${p2.lastName}, ${p2.firstName}`,
                  roomSeekingPartner: false,
                };
              }
              if (p.id === pax2Id) {
                return {
                  ...p,
                  roomPartnerId: p1.id,
                  roomPartnerName: `${p1.lastName}, ${p1.firstName}`,
                  roomSeekingPartner: false,
                };
              }
              return p;
            })
          );
        }
      }
    } catch {
      alert("Error al emparejar habitación.");
    }
  };

  // Desemparejar pasajero
  const handleUnpairRoom = async (paxId: string) => {
    if (!confirm("¿Desvincular esta habitación? Ambos pasajeros volverán a quedar en búsqueda de compañero.")) return;

    try {
      const res = await fetch("/api/operaciones/rooming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unpair", paxId }),
      });

      if (res.ok) {
        const pax = passengers.find((p) => p.id === paxId);
        const partnerId = pax?.roomPartnerId;

        setPassengers((prev) =>
          prev.map((p) => {
            if (p.id === paxId || p.id === partnerId) {
              return {
                ...p,
                roomPartnerId: undefined,
                roomPartnerName: undefined,
                roomSeekingPartner: p.roomType === "doble_compartir",
              };
            }
            return p;
          })
        );
      }
    } catch {
      alert("Error al desemparejar habitación.");
    }
  };

  // Copiar formato oficial para aerolínea
  const copyAirlineManifest = () => {
    const headers = "APELLIDO\tNOMBRES\tTIPO_DOC\tNRO_DOC\tNACIONALIDAD\tNACIMIENTO\tVENC_PASAPORTE\tGENERO\n";
    const rows = passengers
      .map(
        (p) =>
          `${p.lastName}\t${p.firstName}\t${p.documentType}\t${p.passportNumber || p.documentNumber}\t${p.nationality}\t${p.birthDate}\t${p.passportExpiryDate || "-"}\t${p.gender}`
      )
      .join("\n");

    navigator.clipboard.writeText(headers + rows);
    setCopiedNotification("¡Listado de aéreos copiado al portapapeles en formato aerolínea!");
    setTimeout(() => setCopiedNotification(null), 3500);
  };

  // Exportar CSV
  const exportCsv = () => {
    const headers = "Apellido,Nombres,TipoDoc,NroDoc,Pasaporte,Vencimiento,Nacionalidad,Nacimiento,Genero,Habitacion,Companero,BusIda,BusVuelta,HotelPre\n";
    const rows = passengers
      .map((p) =>
        [
          `"${p.lastName}"`,
          `"${p.firstName}"`,
          `"${p.documentType}"`,
          `"${p.documentNumber}"`,
          `"${p.passportNumber || ""}"`,
          `"${p.passportExpiryDate || ""}"`,
          `"${p.nationality}"`,
          `"${p.birthDate}"`,
          `"${p.gender}"`,
          `"${p.roomType}"`,
          `"${p.roomPartnerName || ""}"`,
          p.busInbound ? "SI" : "NO",
          p.busOutbound ? "SI" : "NO",
          p.hotelPre ? "SI" : "NO",
        ].join(",")
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Manifiesto_${departure.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pasajeros en Doble a Compartir que buscan compañero
  const seekingPartner = passengers.filter(
    (p) => p.roomType === "doble_compartir" && (p.roomSeekingPartner || !p.roomPartnerId)
  );

  // Pasajeros agrupados para el Rooming List
  const pairedRooms: { [key: string]: PassengerPax[] } = {};
  const singleRooms: PassengerPax[] = [];
  const tripleRooms: PassengerPax[] = [];

  passengers.forEach((p) => {
    if (p.roomType === "single") {
      singleRooms.push(p);
    } else if (p.roomType === "triple") {
      tripleRooms.push(p);
    } else if (p.roomPartnerId) {
      // Ordenar por ID para agrupar ambos en la misma clave
      const pairKey = [p.id, p.roomPartnerId].sort().join("_");
      if (!pairedRooms[pairKey]) pairedRooms[pairKey] = [];
      if (!pairedRooms[pairKey].some((existing) => existing.id === p.id)) {
        pairedRooms[pairKey].push(p);
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* ── BREADCRUMB & VOLVER ── */}
      <div className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider">
        <Link href="/operaciones/salidas" className="hover:text-white flex items-center gap-1">
          <ArrowLeft size={13} />
          Salidas Grupales
        </Link>
        <span>/</span>
        <span className="text-[#dfb44f] truncate">{departure.title}</span>
      </div>

      {/* ── HEADER PRINCIPAL DE LA SALIDA ── */}
      <div className="bg-[#1f242c] p-6 rounded-3xl border border-white/10 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#ba8728]/15 text-[#dfb44f] border border-[#ba8728]/30">
              {departure.status.replace("_", " ")}
            </span>
            <span className="text-xs font-bold text-white/60 flex items-center gap-1.5">
              <Calendar size={13} className="text-[#ba8728]" />
              Salida: <strong className="text-white">{departure.departureDate}</strong> · Regreso: <strong className="text-white">{departure.returnDate || "A definir"}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            {departure.title}
          </h1>

          <p className="text-xs text-white/60 mt-1 flex items-center gap-2">
            <UserCheck size={14} className="text-[#ba8728]" />
            Coordinador a cargo: <strong className="text-white">{departure.coordinator || "A designar"}</strong>
          </p>
        </div>

        {/* Acciones Rápidas del Header */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setEditingPax(null);
              setIsPaxModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ba8728] via-[#c59b3f] to-[#ba8728] hover:opacity-95 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#ba8728]/25 cursor-pointer"
          >
            <Plus size={16} strokeWidth={3} />
            Cargar Pasajero
          </button>
        </div>
      </div>

      {/* Notificación Copiado */}
      {copiedNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in-up">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* ── PESTAÑAS OPERATIVAS (TABS) ── */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto text-xs font-bold uppercase tracking-wider pb-1">
        <button
          onClick={() => setActiveTab("pasajeros")}
          className={`py-3 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "pasajeros"
              ? "bg-[#ba8728] text-white shadow-md shadow-[#ba8728]/25"
              : "bg-[#1f242c] text-white/60 hover:text-white border border-white/5"
          }`}
        >
          <Users2 size={16} />
          Pasajeros ({passengers.length})
        </button>

        <button
          onClick={() => setActiveTab("rooming")}
          className={`py-3 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "rooming"
              ? "bg-[#ba8728] text-white shadow-md shadow-[#ba8728]/25"
              : "bg-[#1f242c] text-white/60 hover:text-white border border-white/5"
          }`}
        >
          <BedDouble size={16} />
          Rooming Inteligente
          {seekingPartner.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[10px] font-black">
              {seekingPartner.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("aereos")}
          className={`py-3 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "aereos"
              ? "bg-[#ba8728] text-white shadow-md shadow-[#ba8728]/25"
              : "bg-[#1f242c] text-white/60 hover:text-white border border-white/5"
          }`}
        >
          <PlaneTakeoff size={16} />
          Emisión de Aéreos (IATA)
        </button>

        <button
          onClick={() => setActiveTab("logistica")}
          className={`py-3 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "logistica"
              ? "bg-[#ba8728] text-white shadow-md shadow-[#ba8728]/25"
              : "bg-[#1f242c] text-white/60 hover:text-white border border-white/5"
          }`}
        >
          <Bus size={16} />
          Logística Pre/Post
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PESTAÑA 1: LISTADO DE PASAJEROS
      ══════════════════════════════════════════════════════════ */}
      {activeTab === "pasajeros" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1f242c] p-4 rounded-2xl border border-white/10">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Buscar por apellido, nombre o documento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#14181d] border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#ba8728]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportCsv}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <Download size={14} />
                Exportar CSV
              </button>
            </div>
          </div>

          {/* Tabla de Pasajeros */}
          <div className="bg-[#1f242c] rounded-2xl border border-white/10 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#14181d] text-white/60 uppercase text-[10px] tracking-wider border-b border-white/10 font-bold">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Pasajero / Apellido y Nombre</th>
                    <th className="py-3 px-4">Documento / Pasaporte</th>
                    <th className="py-3 px-4">Nacimiento (Edad)</th>
                    <th className="py-3 px-4">Habitación</th>
                    <th className="py-3 px-4">Servicios Pre/Post</th>
                    <th className="py-3 px-4">Estado Doc.</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredPax.length > 0 ? (
                    filteredPax.map((p, i) => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 text-white/40 font-bold">{i + 1}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-white text-sm">
                            {p.lastName}, {p.firstName}
                          </p>
                          <p className="text-[11px] text-white/50">{p.city} · {p.phone}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-white">
                            {p.passportNumber || p.documentNumber || "Sin doc"}
                          </p>
                          <p className="text-[10px] text-white/50">{p.documentType} ({p.nationality})</p>
                        </td>
                        <td className="py-3 px-4 text-white/80">
                          {p.birthDate || "-"} ({p.gender})
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/5 text-[#dfb44f]">
                            {p.roomType.replace("_", " ")}
                          </span>
                          {p.roomPartnerName && (
                            <p className="text-[11px] text-white/60 mt-0.5">Con: {p.roomPartnerName}</p>
                          )}
                          {p.roomSeekingPartner && (
                            <p className="text-[10px] text-amber-300 font-bold mt-0.5">⚠️ Busca acompañante</p>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-white/70">
                          {p.busInbound && <span className="block">🚌 Bus Ida</span>}
                          {p.hotelPre && <span className="block">🏨 Hotel Pre</span>}
                          {!p.busInbound && !p.hotelPre && <span className="text-white/30">Por su cuenta</span>}
                        </td>
                        <td className="py-3 px-4">
                          {p.docsStatus === "pasaporte_por_vencer" ? (
                            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold text-[10px] uppercase border border-red-500/30">
                              ⚠️ Vence &lt; 6m
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase border border-emerald-500/30">
                              ✓ Vigente
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingPax(p);
                                setIsPaxModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
                              title="Editar Ficha"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handlePaxDelete(p.id, `${p.lastName}, ${p.firstName}`)}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300"
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-white/40">
                        No se encontraron pasajeros en esta salida.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          PESTAÑA 2: ROOMING INTELIGENTE
      ══════════════════════════════════════════════════════════ */}
      {activeTab === "rooming" && (
        <div className="space-y-6">
          {/* Alerta de Solos buscando compañero */}
          {seekingPartner.length > 0 && (
            <div className="bg-[#1f242c] border border-amber-500/40 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <BedDouble size={20} className="text-amber-400" />
                <h3 className="text-sm font-black uppercase text-amber-300 tracking-wider">
                  Emparejador de Doble a Compartir ({seekingPartner.length} pasajeros esperando compañero)
                </h3>
              </div>
              <p className="text-xs text-white/70">
                Seleccioná a dos pasajeros de esta salida para juntarlos en la misma habitación con 1 solo clic:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {seekingPartner.map((pax) => {
                  const otherAvailable = seekingPartner.filter((other) => other.id !== pax.id);

                  return (
                    <div
                      key={pax.id}
                      className="bg-[#14181d] p-3.5 rounded-xl border border-white/10 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-white">
                            {pax.lastName}, {pax.firstName}
                          </p>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            {pax.gender} · {pax.city}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 mt-0.5">DNI/Pasaporte: {pax.documentNumber}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          defaultValue=""
                          onChange={(e) => handlePairRoom(pax.id, e.target.value)}
                          className="flex-1 bg-[#1b2027] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#ba8728]"
                        >
                          <option value="">-- Emparejar con... --</option>
                          {otherAvailable.map((other) => (
                            <option key={other.id} value={other.id}>
                              {other.lastName}, {other.firstName} ({other.gender} · {other.city})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Habitaciones ya conformadas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black uppercase text-white tracking-wide">
                Habitaciones Asignadas ({Object.keys(pairedRooms).length + singleRooms.length} habitaciones)
              </h3>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <Printer size={14} />
                Imprimir Rooming List
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Habitaciones Dobles */}
              {Object.entries(pairedRooms).map(([key, occupants], idx) => (
                <div
                  key={key}
                  className="bg-[#1f242c] p-4 rounded-2xl border border-white/10 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-black uppercase text-[#dfb44f]">
                      Habitación Doble #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleUnpairRoom(occupants[0].id)}
                      className="text-white/40 hover:text-red-300 p-1 rounded"
                      title="Desvincular Habitación"
                    >
                      <Unlink size={14} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {occupants.map((occ) => (
                      <div key={occ.id} className="p-2 rounded-lg bg-[#14181d] text-xs">
                        <p className="font-bold text-white">{occ.lastName}, {occ.firstName}</p>
                        <p className="text-[10px] text-white/50">Doc: {occ.documentNumber} ({occ.gender})</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Habitaciones Singles */}
              {singleRooms.map((pax, idx) => (
                <div
                  key={pax.id}
                  className="bg-[#1f242c] p-4 rounded-2xl border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-black uppercase text-white/60">
                      Habitación Single #{idx + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-white/80">
                      Individual
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#14181d] text-xs">
                    <p className="font-bold text-white">{pax.lastName}, {pax.firstName}</p>
                    <p className="text-[10px] text-white/50">Doc: {pax.documentNumber} ({pax.gender})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          PESTAÑA 3: EMISIÓN DE AÉREOS (MANIFIESTO IATA)
      ══════════════════════════════════════════════════════════ */}
      {activeTab === "aereos" && (
        <div className="space-y-4">
          <div className="bg-[#1f242c] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wide flex items-center gap-2">
                <PlaneTakeoff size={18} className="text-[#ba8728]" />
                Manifiesto Oficial para Emisión de Aéreos ({passengers.length} Pasajeros)
              </h3>
              <p className="text-xs text-white/50">
                Formato estándar IATA para enviar a la aerolínea o consolidador aéreo sin errores de tipeo.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={copyAirlineManifest}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ba8728] to-[#dfb44f] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-[#ba8728]/20 cursor-pointer"
              >
                <Copy size={14} />
                Copiar Formato Aerolínea
              </button>
            </div>
          </div>

          <div className="bg-[#1f242c] rounded-2xl border border-white/10 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#14181d] text-white/60 uppercase text-[10px] tracking-wider border-b border-white/10 font-bold font-sans">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">APELLIDO</th>
                    <th className="py-3 px-4">NOMBRES</th>
                    <th className="py-3 px-4">TIPO DOC</th>
                    <th className="py-3 px-4">Nº PASAPORTE / DNI</th>
                    <th className="py-3 px-4">NACIONALIDAD</th>
                    <th className="py-3 px-4">F. NACIMIENTO</th>
                    <th className="py-3 px-4">VENCIMIENTO</th>
                    <th className="py-3 px-4">GÉNERO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {passengers.map((p, i) => (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 text-white/40">{i + 1}</td>
                      <td className="py-3 px-4 font-bold text-white">{p.lastName}</td>
                      <td className="py-3 px-4 font-bold text-white">{p.firstName}</td>
                      <td className="py-3 px-4 text-white/70">{p.documentType}</td>
                      <td className="py-3 px-4 text-[#dfb44f] font-bold">
                        {p.passportNumber || p.documentNumber}
                      </td>
                      <td className="py-3 px-4 text-white/70">{p.nationality}</td>
                      <td className="py-3 px-4 text-white/70">{p.birthDate}</td>
                      <td className="py-3 px-4 text-white/70">{p.passportExpiryDate || "-"}</td>
                      <td className="py-3 px-4 font-bold text-white">{p.gender}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          PESTAÑA 4: LOGÍSTICA PRE Y POST VIAJE
      ══════════════════════════════════════════════════════════ */}
      {activeTab === "logistica" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Traslados en Bus */}
            <div className="bg-[#1f242c] p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Bus size={18} className="text-[#ba8728]" />
                <h3 className="text-sm font-black uppercase text-white tracking-wider">
                  Traslados en Bus Larga Distancia
                </h3>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase text-[#dfb44f]">Bus Ida (Hacia Buenos Aires)</p>
                {passengers.filter((p) => p.busInbound).map((p) => (
                  <div key={p.id} className="p-2 rounded-lg bg-[#14181d] text-xs">
                    <p className="font-bold text-white">{p.lastName}, {p.firstName}</p>
                    <p className="text-[10px] text-white/50">{p.busInboundRoute}</p>
                  </div>
                ))}

                <p className="text-xs font-bold uppercase text-[#dfb44f] pt-3">Bus Vuelta (Hacia Interior)</p>
                {passengers.filter((p) => p.busOutbound).map((p) => (
                  <div key={p.id} className="p-2 rounded-lg bg-[#14181d] text-xs">
                    <p className="font-bold text-white">{p.lastName}, {p.firstName}</p>
                    <p className="text-[10px] text-white/50">{p.busOutboundRoute}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotelería Pre y Post en Bs As */}
            <div className="bg-[#1f242c] p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <BedDouble size={18} className="text-[#ba8728]" />
                <h3 className="text-sm font-black uppercase text-white tracking-wider">
                  Hotelería Pre y Post en Bs As
                </h3>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase text-[#dfb44f]">Noche Pre-Circuito</p>
                {passengers.filter((p) => p.hotelPre).map((p) => (
                  <div key={p.id} className="p-2 rounded-lg bg-[#14181d] text-xs">
                    <p className="font-bold text-white">{p.lastName}, {p.firstName}</p>
                    <p className="text-[10px] text-white/50">{p.hotelPreName}</p>
                  </div>
                ))}

                <p className="text-xs font-bold uppercase text-[#dfb44f] pt-3">Noche Post-Circuito</p>
                {passengers.filter((p) => p.hotelPost).map((p) => (
                  <div key={p.id} className="p-2 rounded-lg bg-[#14181d] text-xs">
                    <p className="font-bold text-white">{p.lastName}, {p.firstName}</p>
                    <p className="text-[10px] text-white/50">{p.hotelPostName}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Traslados a Aeropuertos */}
            <div className="bg-[#1f242c] p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <PlaneTakeoff size={18} className="text-[#ba8728]" />
                <h3 className="text-sm font-black uppercase text-white tracking-wider">
                  Traslados Ezeiza / Aeroparque
                </h3>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase text-[#dfb44f]">Hacia el Aeropuerto (Salida)</p>
                {passengers.filter((p) => p.transferAirportOut).map((p) => (
                  <div key={p.id} className="p-2 rounded-lg bg-[#14181d] text-xs">
                    <p className="font-bold text-white">{p.lastName}, {p.firstName}</p>
                  </div>
                ))}

                <p className="text-xs font-bold uppercase text-[#dfb44f] pt-3">Desde el Aeropuerto (Llegada)</p>
                {passengers.filter((p) => p.transferAirportIn).map((p) => (
                  <div key={p.id} className="p-2 rounded-lg bg-[#14181d] text-xs">
                    <p className="font-bold text-white">{p.lastName}, {p.firstName}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cargar / Editar Pasajero */}
      {isPaxModalOpen && (
        <PassengerModal
          isOpen={isPaxModalOpen}
          onClose={() => {
            setIsPaxModalOpen(false);
            setEditingPax(null);
          }}
          onSave={handlePaxSaved}
          passenger={editingPax}
          departures={allDepartures}
          allPassengers={passengers}
          currentUser={user}
        />
      )}
    </div>
  );
}
