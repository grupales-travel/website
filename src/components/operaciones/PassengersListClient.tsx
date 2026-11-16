"use client";

import { useState } from "react";
import Link from "next/link";
import { DepartureGroup, OperatorUser, PassengerPax } from "@/types/operations";
import {
  Users2,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Compass,
  AlertTriangle,
  BedDouble,
} from "lucide-react";
import PassengerModal from "./PassengerModal";

interface Props {
  user: OperatorUser | null;
  initialDepartures: DepartureGroup[];
  initialPassengers: PassengerPax[];
}

export default function PassengersListClient({
  user,
  initialDepartures,
  initialPassengers,
}: Props) {
  const [departures] = useState<DepartureGroup[]>(initialDepartures);
  const [passengers, setPassengers] = useState<PassengerPax[]>(initialPassengers);
  const [search, setSearch] = useState("");
  const [departureFilter, setDepartureFilter] = useState<string>("todas");
  const [roomFilter, setRoomFilter] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPax, setEditingPax] = useState<PassengerPax | null>(null);

  // Filtrado
  const filteredPax = passengers.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.lastName.toLowerCase().includes(q) ||
      p.firstName.toLowerCase().includes(q) ||
      p.documentNumber.includes(q) ||
      (p.passportNumber && p.passportNumber.toLowerCase().includes(q)) ||
      p.city.toLowerCase().includes(q) ||
      p.phone.includes(q);

    const matchesDeparture = departureFilter === "todas" || p.departureId === departureFilter;
    const matchesRoom = roomFilter === "todos" || p.roomType === roomFilter;

    return matchesSearch && matchesDeparture && matchesRoom;
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
    setIsModalOpen(false);
    setEditingPax(null);
  };

  const handlePaxDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar al pasajero ${name}?`)) return;

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

  const exportAllCsv = () => {
    const headers = "Salida,Apellido,Nombres,TipoDoc,NroDoc,Pasaporte,Vencimiento,Nacionalidad,Nacimiento,Genero,Habitacion,Companero,Telefono,Ciudad,Asesor\n";
    const rows = filteredPax
      .map((p) => {
        const dep = departures.find((d) => d.id === p.departureId);
        return [
          `"${dep?.title || ""}"`,
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
          `"${p.phone}"`,
          `"${p.city}"`,
          `"${p.createdBy || ""}"`,
        ].join(",");
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Listado_Pasajeros_GrupalesTravel.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users2 size={16} className="text-[#ba8728]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#dfb44f]">
              Base General de Clientes & Pasajeros
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Pasajeros ({passengers.length})
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Registro unificado de todos los pasajeros confirmados en todas las salidas grupales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportAllCsv}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Download size={14} />
            Exportar CSV
          </button>

          <button
            onClick={() => {
              setEditingPax(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ba8728] via-[#c59b3f] to-[#ba8728] hover:opacity-95 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#ba8728]/25 cursor-pointer"
          >
            <Plus size={16} strokeWidth={3} />
            Cargar Pasajero
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-[#1f242c] p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Buscar por apellido, nombre, doc o ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#14181d] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#ba8728]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Selector de Salida */}
          <select
            value={departureFilter}
            onChange={(e) => setDepartureFilter(e.target.value)}
            className="bg-[#14181d] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ba8728]"
          >
            <option value="todas">Todas las Salidas</option>
            {departures.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>

          {/* Selector de Habitación */}
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="bg-[#14181d] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ba8728]"
          >
            <option value="todos">Cualquier Habitación</option>
            <option value="doble_compartir">Doble a Compartir</option>
            <option value="single">Single</option>
            <option value="doble_matrimonial">Doble Matrimonial</option>
            <option value="doble_twin">Doble Twin</option>
            <option value="triple">Triple</option>
          </select>
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
                <th className="py-3 px-4">Salida Grupal</th>
                <th className="py-3 px-4">Documento / Pasaporte</th>
                <th className="py-3 px-4">Habitación</th>
                <th className="py-3 px-4">Contacto</th>
                <th className="py-3 px-4">Estado Doc.</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPax.length > 0 ? (
                filteredPax.map((p, i) => {
                  const dep = departures.find((d) => d.id === p.departureId);

                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 text-white/40 font-bold">{i + 1}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-white text-sm">
                          {p.lastName}, {p.firstName}
                        </p>
                        <p className="text-[11px] text-white/50">{p.nationality} · {p.birthDate}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/operaciones/salidas/${p.departureId}`}
                          className="font-bold text-[#dfb44f] hover:underline flex items-center gap-1"
                        >
                          <Compass size={12} className="shrink-0" />
                          <span className="truncate max-w-[160px]">{dep?.title || "Salida"}</span>
                        </Link>
                        <p className="text-[10px] text-white/40">{dep?.departureDate}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">
                          {p.passportNumber || p.documentNumber || "Sin doc"}
                        </p>
                        <p className="text-[10px] text-white/50">{p.documentType}</p>
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
                        <p>{p.phone}</p>
                        <p className="text-white/40">{p.city}</p>
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
                              setIsModalOpen(true);
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-white/40">
                    No se encontraron pasajeros con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <PassengerModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPax(null);
          }}
          onSave={handlePaxSaved}
          passenger={editingPax}
          departures={departures}
          allPassengers={passengers}
          currentUser={user}
        />
      )}
    </div>
  );
}

