"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Award, X } from "lucide-react";

function getImagePath(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
  return `/team/${slug}.webp`;
}

interface TeamMember {
  name: string;
  role: string;
  title?: string;
  description?: string;
}

interface Department {
  name: string;
  intro: string;
  members: TeamMember[];
}

const DIRECTORS: TeamMember[] = [
  {
    name: "Andrés Arellano",
    role: "Socio Gerente",
    title: "Licenciado en Turismo",
    description: "Responsable de la dirección general, estrategia comercial y desarrollo de Grupales Travel.",
  },
  {
    name: "Marina Mendoza",
    role: "Socia Gerente",
    title: "Licenciada en Turismo",
    description: "Responsable del desarrollo institucional, planificación estratégica y diseño de productos turísticos.",
  },
];

const DEPARTMENTS: Department[] = [
  {
    name: "Equipo Comercial",
    intro: "Nuestros asesores acompañan a cada pasajero en la elección del viaje ideal, brindando atención personalizada y seguimiento durante todo el proceso.",
    members: [
      { name: "Ramiro Ferreras", role: "Asesor Comercial" },
      { name: "Abel López", role: "Asesor Comercial" },
      { name: "Patricia Maluzan", role: "Asesora Comercial" },
    ],
  },
  {
    name: "Representantes",
    intro: "Contamos con representantes en distintas ciudades para brindar una atención más cercana y personalizada.",
    members: [
      { name: "Andrés Méndez", role: "Representante Neuquén y Río Negro" },
      { name: "Leandro Pérez", role: "Representante Córdoba" },
      { name: "Silvana Martínez", role: "Representante CABA" },
    ],
  },
  {
    name: "Administración y Finanzas",
    intro: "El área administrativa garantiza la correcta gestión de pagos, documentación, facturación y procesos internos para brindar seguridad y transparencia en cada operación.",
    members: [
      { name: "Luz Sosa", role: "Administración" },
      { name: "CPN Yesica Funez", role: "Contadora Pública Nacional / Finanzas" },
    ],
  },
  {
    name: "Operaciones y Coordinación",
    intro: "Son quienes convierten cada reserva en un viaje perfectamente organizado, coordinando servicios, documentación, proveedores y el acompañamiento de los grupos.",
    members: [
      { name: "Nicolás Sánchez", role: "Operaciones" },
      { name: "Alejandro Insaurralde", role: "Operaciones" },
      { name: "Martín Estanguet", role: "Operaciones" },
    ],
  },
  {
    name: "Sistemas",
    intro: "Soporte tecnológico, mantenimiento de infraestructura digital y desarrollo de herramientas internas para optimizar el servicio.",
    members: [
      { name: "Nicolás Sánchez", role: "Soporte Técnico y Sistemas" },
    ],
  },
  {
    name: "Representantes Comerciales",
    intro: "Embajadores de nuestra marca en distintas ciudades, facilitando el asesoramiento presencial a pasajeros de todo el país.",
    members: [
      { name: "Juan Pablo Olivares", role: "Marketing y Comunicación" },
      { name: "Facundo Cortines", role: "Marketing y Comunicación" },
    ],
  },
];

export default function TeamSection() {
  const [selectedMember, setSelectedMember] = useState<{ name: string; image: string } | null>(null);

  // Función para obtener iniciales para el avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-20">
      {/* Sección Directores */}
      <div>
        <div className="text-center mb-16">
          <h3 className="text-[#a66d03] text-xs font-bold uppercase tracking-widest mb-2">
            Liderazgo
          </h3>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1810]">
            Dirección
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {DIRECTORS.map((director, i) => (
            <motion.div
              key={director.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-gradient-to-b from-white to-[#FAF7F2] border border-[#a66d03]/15 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center hover:border-[#bf8b2a]/45 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group"
            >
              {/* Imagen de perfil rectangular 2:3 con marco decorativo */}
              <div 
                className="relative mb-8 cursor-zoom-in shrink-0 group/img"
                onClick={() => setSelectedMember({ name: director.name, image: getImagePath(director.name) })}
              >
                {/* Marco de fondo */}
                <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border-2 border-[#a66d03]/20 pointer-events-none -z-10 transition-transform duration-300 group-hover/img:translate-x-4 group-hover/img:translate-y-4" />
                
                <div className="w-64 h-[384px] rounded-2xl bg-white border border-[#a66d03]/20 overflow-hidden relative shadow-md group-hover/img:scale-[1.01] transition-transform duration-300">
                  <img
                    src={getImagePath(director.name)}
                    alt={director.name}
                    className="absolute inset-0 w-full h-full object-cover z-10"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="text-3xl font-black tracking-wider text-[#a66d03] absolute inset-0 flex items-center justify-center bg-[#FAF7F2]">
                    {getInitials(director.name)}
                  </span>
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#bf8b2a] flex items-center justify-center border-2 border-white z-20 shadow-md">
                    <Award size={14} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Información */}
              <div className="space-y-3 w-full">
                <h4 className="text-[#a66d03] text-xs font-bold uppercase tracking-widest">
                  {director.title}
                </h4>
                <h3 className="text-2xl font-black text-[#1E1810] group-hover:text-[#a66d03] transition-colors duration-200 leading-tight">
                  {director.name}
                </h3>
                <p className="text-[#1E1810]/60 text-sm font-semibold uppercase tracking-wider">
                  {director.role}
                </p>
                <p className="text-[#1E1810]/75 text-[15px] leading-relaxed pt-3 border-t border-[#1E1810]/5 mt-2">
                  {director.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Departamentos */}
      <div className="space-y-16">
        {DEPARTMENTS.map((dept, deptIndex) => (
          <div key={dept.name} className="max-w-6xl mx-auto border-t border-[#1E1810]/5 pt-12">
            <div className="flex flex-col gap-10">
              {/* Info del departamento - Arriba y centrado */}
              <div className="text-center max-w-2xl mx-auto space-y-2.5">
                <h3 className="text-2xl font-bold text-[#a66d03] tracking-tight">
                  {dept.name}
                </h3>
                <p className="text-[#1E1810]/60 text-sm sm:text-base leading-relaxed">
                  {dept.intro}
                </p>
              </div>

              {/* Integrantes - Abajo en grilla centrada */}
              <div className="flex flex-wrap gap-8 justify-center">
                {dept.members.map((member, memberIndex) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: memberIndex * 0.05 + deptIndex * 0.05, duration: 0.4 }}
                    className="bg-gradient-to-b from-white to-[#FAF7F2] border border-[#1E1810]/5 rounded-3xl p-5 hover:border-[#a66d03]/25 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-500 flex flex-col items-center text-center w-[230px] group"
                  >
                    {/* Imagen de perfil rectangular 2:3 con marco decorativo */}
                    <div 
                      className="relative mb-6 cursor-zoom-in shrink-0 group/img"
                      onClick={() => setSelectedMember({ name: member.name, image: getImagePath(member.name) })}
                    >
                      {/* Marco de fondo */}
                      <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl border border-[#a66d03]/15 pointer-events-none -z-10 transition-transform duration-300 group-hover/img:translate-x-2.5 group-hover/img:translate-y-2.5" />
                      
                      <div className="w-44 h-66 rounded-xl bg-white border border-[#a66d03]/10 overflow-hidden relative shadow-md group-hover/img:scale-[1.01] transition-transform duration-300">
                        <img
                          src={getImagePath(member.name)}
                          alt={member.name}
                          className="absolute inset-0 w-full h-full object-cover z-10"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-[#FAF7F2]">
                          <User size={28} className="text-[#1E1810]/20" />
                        </div>
                      </div>
                    </div>

                    <div className="overflow-hidden w-full space-y-0.5">
                      <h4 className="text-base font-bold text-[#1E1810] group-hover:text-[#a66d03] transition-colors duration-200 truncate">
                        {member.name}
                      </h4>
                      <p className="text-[#1E1810]/50 text-xs font-semibold tracking-wide uppercase truncate">
                        {member.role}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal de Framer Motion */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
            className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative max-w-full max-h-[85vh] aspect-[2/3] w-full sm:w-[450px] bg-white rounded-3xl overflow-hidden shadow-2xl p-2 cursor-default border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedMember.image}
                alt={selectedMember.name}
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Botón Cerrar */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 flex items-center justify-center text-white border border-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
