"use client";

import { useState } from "react";
import Link from "next/link";
import { DepartureGroup, OperatorUser, PassengerPax } from "@/types/operations";
import {
  Compass,
  Plus,
  Calendar,
  UserCheck,
  BedDouble,
  Search,
  Filter,
  Trash2,
  Edit,
  ArrowRight,
} from "lucide-react";
import DepartureModal from "./DepartureModal";

interface Props {
  user: OperatorUser | null;
  initialDepartures: DepartureGroup[];
  initialPassengers: PassengerPax[];
}

export default function SalidasListClient({
  user,
  initialDepartures,
  initialPassengers,
}: Props) {
  const [departures, setDepartures] = useState<DepartureGroup[]>(initialDepartures);
  const [passengers, setPassengers] = useState<PassengerPax[]>(initialPassengers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDep, setEditingDep] = useState<DepartureGroup | null>(null);

  // Filtrado
  const filtered = departures.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.coordinator.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "todas" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaved = (saved: DepartureGroup) => {
    setDepartures((prev) => {
      const idx = prev.findIndex((d) => d.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    setIsModalOpen(false);
    setEditingDep(null);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de eliminar la salida "${title}"?`)) return;

    try {
      const res = await fetch(`/api/operaciones/salidas?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setDepartures((prev) => prev.filter((d) => d.id !== id));
      } else {
        alert("No se pudo eliminar la salida.");
      }
    } catch {
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass size={16} className="text-[#ba8728]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#dfb44f]">
              Gestión de Circuitos y Grupos
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Salidas Grupales ({departures.length})
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Administrá las fechas, cupos, coordinadores y requisitos de cada viaje grupal.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDep(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ba8728] via-[#c59b3f] to-[#ba8728] hover:opacity-95 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#ba8728]/25 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={3} />
          Nueva Salida Grupal
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-[#1f242c] p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Buscar por destino o coordinador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#14181d] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#ba8728]"
          />
        </div>

        {/* Filtro de Estado */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <Filter size={14} className="text-white/40 shrink-0" />
          {[
            { id: "todas", label: "Todas" },
            { id: "abierta", label: "Abiertas" },
            { id: "ultimos_cupos", label: "Últimos Cupos" },
            { id: "cerrada", label: "Cerradas" },
            { id: "en_viaje", label: "En Viaje" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st.id
                  ? "bg-[#ba8728] text-white shadow-sm"
                  : "bg-[#14181d] text-white/60 hover:text-white border border-white/10"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Salidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((dep) => {
          const depPax = passengers.filter((p) => p.departureId === dep.id);
          const occupied = depPax.length;
          const percentage = Math.min(Math.round((occupied / dep.capacity) * 100), 100);
          
          const seekingPartner = depPax.filter(
            (p) => p.roomType === "doble_compartir" && (p.roomSeekingPartner || !p.roomPartnerId)
          ).length;

          return (
            <div
              key={dep.id}
              className="bg-[#1f242c] border border-white/10 hover:border-[#ba8728]/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#ba8728]/15 text-[#dfb44f] border border-[#ba8728]/30">
                    {dep.status.replace("_", " ")}
                  </span>
                  
                  {user?.role === "admin" && (
                    <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingDep(dep);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
                        title="Editar Salida"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(dep.id, dep.title)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300"
                        title="Eliminar Salida"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <Link
                  href={`/operaciones/salidas/${dep.id}`}
                  className="block group/title"
                >
                  <h3 className="text-lg font-black uppercase text-white tracking-tight leading-snug group-hover/title:text-[#dfb44f] transition-colors">
                    {dep.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-4 text-xs text-white/60 mt-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#ba8728]" />
                    {dep.departureDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <UserCheck size={13} className="text-[#ba8728]" />
                    {dep.coordinator || "A designar"}
                  </span>
                </div>

                {/* Barra de Ocupación */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-white/60">Ocupación</span>
                    <span className="text-[#dfb44f]">
                      {occupied} / {dep.capacity} cupos ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage >= 90
                          ? "bg-amber-400"
                          : percentage >= 50
                          ? "bg-emerald-400"
                          : "bg-[#ba8728]"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {seekingPartner > 0 && (
                  <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[11px] font-semibold flex items-center gap-2">
                    <BedDouble size={14} className="text-amber-400 shrink-0" />
                    <span>{seekingPartner} en doble a compartir buscando pareja</span>
                  </div>
                )}
              </div>

              {/* Botón Principal de Entrada a la Salida */}
              <div className="mt-5 pt-3 border-t border-white/10">
                <Link
                  href={`/operaciones/salidas/${dep.id}`}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-[#ba8728] text-white hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <span>Abrir Gestión Operativa</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nueva / Editar Salida */}
      {isModalOpen && (
        <DepartureModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingDep(null);
          }}
          onSave={handleSaved}
          departure={editingDep}
        />
      )}
    </div>
  );
}

