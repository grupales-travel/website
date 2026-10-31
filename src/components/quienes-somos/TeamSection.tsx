"use client";

import { useState } from "react";
import { User, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function getImagePath(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
  return `/team/${slug}.png`;
}

interface TeamMember {
  name: string;
  role: string;
  department: string;
  category: "direccion" | "comercial" | "representantes" | "operaciones-admin" | "marketing-sistemas";
  title?: string;
  description?: string;
}

const DIRECTORS: TeamMember[] = [
  {
    name: "Andrés Arellano",
    role: "Socio Gerente",
    department: "Dirección",
    category: "direccion",
    title: "Licenciado en Turismo",
    description: "Dirección general, estrategia comercial y desarrollo de nuevos destinos.",
  },
  {
    name: "Marina Mendoza",
    role: "Socia Gerente",
    department: "Dirección",
    category: "direccion",
    title: "Licenciada en Turismo",
    description: "Desarrollo institucional, planificación estratégica y diseño de productos turísticos.",
  },
];

const TEAM_MEMBERS: TeamMember[] = [
  // Equipo Comercial
  { name: "Ramiro Ferreras", role: "Asesor Comercial", department: "Comercial", category: "comercial" },
  { name: "Abel López", role: "Asesor Comercial", department: "Comercial", category: "comercial" },
  { name: "Patricia Maluzan", role: "Asesora Comercial", department: "Comercial", category: "comercial" },

  // Representantes
  { name: "Andrés Méndez", role: "Representante", title: "Neuquén y Río Negro", department: "Representantes", category: "representantes" },
  { name: "Leandro Pérez", role: "Representante", title: "Córdoba", department: "Representantes", category: "representantes" },
  { name: "Silvana Martínez", role: "Representante", title: "CABA", department: "Representantes", category: "representantes" },

  // Operaciones y Administración
  { name: "Nicolás Sánchez", role: "Operaciones", department: "Operaciones", category: "operaciones-admin" },
  { name: "Alejandro Insaurralde", role: "Operaciones", department: "Operaciones", category: "operaciones-admin" },
  { name: "Luz Sosa", role: "Administración", department: "Administración", category: "operaciones-admin" },
  { name: "CPN Yesica Funez", role: "Finanzas", title: "Contadora Pública Nac.", department: "Administración", category: "operaciones-admin" },

  // Marketing y Sistemas
  { name: "Martín Estanguet", role: "Manager Design", department: "Marketing", category: "marketing-sistemas" },
  { name: "Juan Pablo Olivares", role: "Marketing y Comunicación", department: "Marketing", category: "marketing-sistemas" },
  { name: "Facundo Cortines", role: "Marketing y Comunicación", department: "Marketing", category: "marketing-sistemas" },
  { name: "Matías Amoroso", role: "Sistemas & Circuitos", title: "Técnico en Turismo", department: "Sistemas", category: "marketing-sistemas" },
];

const CATEGORIES = [
  { id: "todos", label: "Todo el Equipo", count: 16 },
  { id: "direccion", label: "Dirección", count: 2 },
  { id: "comercial", label: "Comercial", count: 3 },
  { id: "representantes", label: "Representantes", count: 3 },
  { id: "operaciones-admin", label: "Operaciones & Admin", count: 4 },
  { id: "marketing-sistemas", label: "Marketing & Sistemas", count: 4 },
] as const;

export default function TeamSection() {
  const [activeTab, setActiveTab] = useState<string>("todos");

  const getInitials = (name: string) => {
    return name
      .replace("CPN ", "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const showDirectors = activeTab === "todos" || activeTab === "direccion";
  const filteredMembers = activeTab === "todos"
    ? TEAM_MEMBERS
    : TEAM_MEMBERS.filter((m) => m.category === activeTab);

  return (
    <div className="space-y-10">

      {/* Selector de Filtros por Categoría */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto px-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-[#ba8728] text-white shadow-md shadow-[#ba8728]/25 scale-105"
                  : "bg-white text-[#1E1810]/70 border border-[#1E1810]/10 hover:border-[#ba8728] hover:text-[#1E1810]"
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/25 text-white" : "bg-[#1E1810]/5 text-[#1E1810]/50"}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bloque Liderazgo / Dirección: Destacados, fotos grandes y presencia protagonista */}
      {showDirectors && (
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-[#72500c] text-[11px] font-bold uppercase tracking-widest">
              Liderazgo
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#1E1810] tracking-tight">
              Dirección General
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {DIRECTORS.map((director) => (
              <div
                key={director.name}
                className="bg-white border-2 border-[#ba8728]/35 hover:border-[#ba8728] rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
              >
                {/* Foto más grande que el resto, destacada como directivo */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden mb-4 border-2 border-[#ba8728]/40 shadow-sm bg-[#FAF7F2]">
                  <img
                    src={getImagePath(director.name)}
                    alt={director.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-[#FAF7F2] -z-10 text-[#ba8728] font-black text-2xl">
                    {getInitials(director.name)}
                  </div>
                </div>

                {/* Badge de Rol */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ba8728]/15 text-[#72500c] text-xs font-bold uppercase tracking-wider mb-1.5">
                  <Award size={13} className="text-[#ba8728]" />
                  {director.role}
                </div>

                {/* Nombre y Título */}
                <h4 className="text-xl sm:text-2xl font-bold font-serif text-[#0F213C] tracking-tight">
                  {director.name}
                </h4>
                <p className="text-[#72500c] text-xs font-bold tracking-wide mt-0.5">
                  {director.title}
                </p>

                {/* Reseña estratégica */}
                <p className="text-[#1E1810]/75 text-xs sm:text-sm leading-relaxed mt-2 max-w-xs">
                  {director.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grilla de Integrantes: Con borde de relleno fino (padding sutil) para que no se vean excesivamente grandes */}
      {filteredMembers.length > 0 && (
        <div className="space-y-4 pt-2">
          {activeTab === "todos" && (
            <div className="text-center">
              <span className="text-[#72500c] text-[11px] font-bold uppercase tracking-widest">
                Especialistas
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#1E1810] tracking-tight">
                Equipo Interdisciplinario
              </h3>
            </div>
          )}

          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 max-w-6xl mx-auto"
          >
            <AnimatePresence>
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-[#1E1810]/10 hover:border-[#ba8728] rounded-2xl p-2.5 sm:p-3 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
                >
                  {/* Foto con margen/borde de relleno controlado y bordes redondeados elegantes */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2.5 bg-[#FAF7F2] border border-[#1E1810]/5">
                    <img
                      src={getImagePath(member.name)}
                      alt={member.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-[#FAF7F2] -z-10">
                      <User size={32} className="text-[#1E1810]/20" />
                    </div>
                  </div>

                  {/* Franja de información inferior limpia y proporcionada */}
                  <div className="px-1 pb-1 flex flex-col items-center text-center justify-between flex-1 space-y-0.5">
                    <h4 className="text-sm sm:text-base font-bold text-[#0F213C] tracking-tight leading-snug group-hover:text-[#ba8728] transition-colors">
                      {member.name}
                    </h4>
                    
                    <p className="text-xs font-semibold text-[#db5835] leading-tight">
                      {member.role}
                    </p>

                    {member.title ? (
                      <p className="text-[11px] font-medium text-[#1E1810]/60 leading-tight">
                        {member.title}
                      </p>
                    ) : (
                      <div className="h-1.5" />
                    )}

                    <span className="mt-1 inline-block text-[10px] font-bold text-[#72500c] bg-[#ba8728]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {member.department}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

    </div>
  );
}
