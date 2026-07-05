"use client";

import { motion } from "framer-motion";
import { User, Award } from "lucide-react";

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
    ],
  },
  {
    name: "Sistemas y Desarrollo de Producto",
    intro: "Trabajamos permanentemente en el desarrollo de herramientas tecnológicas y en el diseño de nuevos circuitos para ofrecer propuestas innovadoras y una mejor experiencia para nuestros pasajeros.",
    members: [
      { name: "Matías Amoroso", role: "Sistemas y Desarrollo de Producto" },
    ],
  },
  {
    name: "Marketing y Comunicación",
    intro: "Creamos los contenidos, desarrollamos la identidad visual de cada salida y comunicamos nuestras experiencias para inspirar nuevos viajes.",
    members: [
      { name: "Juan Pablo Olivares", role: "Marketing y Comunicación" },
      { name: "Facundo Cortines", role: "Marketing y Comunicación" },
    ],
  },
];

export default function TeamSection() {
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
        <div className="text-center mb-12">
          <h3 className="text-[#d9bf8f] text-xs font-bold uppercase tracking-widest mb-2">
            Liderazgo
          </h3>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Dirección
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {DIRECTORS.map((director, i) => (
            <motion.div
              key={director.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-[#261E14]/40 border border-[#a66d03]/30 rounded-3xl p-8 backdrop-blur-sm shadow-2xl flex flex-col md:flex-row gap-6 items-center text-center md:text-left hover:border-[#bf8b2a]/55 transition-all duration-300 group"
            >
              {/* Avatar placeholder con iniciales */}
              <div className="w-24 h-24 rounded-full bg-[#1E1810] border border-[#a66d03]/40 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300 relative">
                <span className="text-2xl font-black tracking-wider text-[#d9bf8f]">
                  {getInitials(director.name)}
                </span>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#bf8b2a] flex items-center justify-center border-2 border-[#1e1810]">
                  <Award size={12} className="text-white" />
                </div>
              </div>

              {/* Información */}
              <div className="flex-1 space-y-2">
                <h4 className="text-[#d9bf8f] text-xs font-bold uppercase tracking-widest">
                  {director.title}
                </h4>
                <h3 className="text-2xl font-bold text-white group-hover:text-[#d9bf8f] transition-colors duration-200">
                  {director.name}
                </h3>
                <p className="text-white/40 text-sm font-semibold uppercase tracking-wider">
                  {director.role}
                </p>
                <p className="text-white/60 text-sm leading-relaxed pt-2 border-t border-white/5">
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
          <div key={dept.name} className="max-w-6xl mx-auto border-t border-white/5 pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Info del departamento */}
              <div className="lg:col-span-1 space-y-3">
                <h3 className="text-xl font-bold text-[#d9bf8f] tracking-tight">
                  {dept.name}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {dept.intro}
                </p>
              </div>

              {/* Integrantes */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {dept.members.map((member, memberIndex) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: memberIndex * 0.05 + deptIndex * 0.05, duration: 0.4 }}
                      className="bg-[#1E1810]/60 border border-white/5 rounded-2xl p-5 hover:border-[#a66d03]/30 transition-all duration-300 flex items-center gap-3.5 group"
                    >
                      <div className="w-11 h-11 rounded-full bg-[#261E14] border border-white/5 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-[#a66d03]/10 group-hover:border-[#a66d03]/30 transition-colors duration-300">
                        <User size={16} className="text-white/40 group-hover:text-[#d9bf8f] transition-colors" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-white group-hover:text-[#d9bf8f] transition-colors duration-200 truncate">
                          {member.name}
                        </h4>
                        <p className="text-white/35 text-[11px] font-medium tracking-wide uppercase truncate">
                          {member.role}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
