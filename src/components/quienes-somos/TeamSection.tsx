import { User, Globe } from "lucide-react";

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
    name: "Sistemas",
    intro: "Soporte tecnológico, mantenimiento de infraestructura digital y desarrollo de herramientas internas para optimizar el servicio.",
    members: [
      { 
        name: "Matías Amoroso", 
        role: "A cargo de Sistemas y diseño de circuitos", 
        title: "TÉCNICO EN TURISMO",
        description: "Organizo cada detalle para que tu viaje sea perfecto desde el primer momento." 
      },
    ],
  },
  {
    name: "Marketing y Comunicación",
    intro: "Creamos los contenidos, desarrollamos la identidad visual de cada salida y comunicamos nuestras experiencias para inspirar nuevos viajes.",
    members: [
      { name: "Juan Pablo Olivares", role: "Marketing y Comunicación" },
      { name: "Facundo Cortines", role: "Marketing y Comunicación" },
      { 
        name: "Martín Estanguet", 
        role: "MANAGER DESIGN", 
        title: "EQUIPO DE MARKETING Y COMUNICACIÓN", 
        description: "Estamos para ayudarte a planificar tu próximo viaje." 
      },
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
        <div className="text-center mb-16">
          <h3 className="text-[#72500c] text-xs font-bold uppercase tracking-widest mb-2">
            Liderazgo
          </h3>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1810]">
            Dirección
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {DIRECTORS.map((director) => (
            <div
              key={director.name}
              className="bg-[#F4F0EB] border border-[#db5835]/20 rounded-3xl shadow-xl flex flex-col overflow-hidden w-full max-w-[340px] mx-auto border-b-8 border-b-[#db5835] hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group"
            >
              {/* Imagen Cuadrada de perfil 1:1 (Sin zoom click) */}
              <div className="w-full aspect-square overflow-hidden relative shrink-0">
                <img
                  src={getImagePath(director.name)}
                  alt={director.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-102"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-[#FAF7F2] -z-10">
                  <span className="text-3xl font-black tracking-wider text-[#db5835]">
                    {getInitials(director.name)}
                  </span>
                </div>
              </div>

              {/* Banner / Credencial abajo */}
              <div className="p-6 flex-1 flex flex-col items-center text-center justify-between min-h-[240px]">
                <div className="w-full space-y-1">
                  <h3 className="text-2xl md:text-3xl font-bold font-serif text-[#0F213C] tracking-tight">
                    {director.name}
                  </h3>
                  <div className="w-12 h-0.5 bg-[#db5835] mx-auto mt-2 mb-3.5" />
                  <p className="text-[#0F213C] text-sm md:text-base font-bold tracking-[0.18em] uppercase">
                    {director.role}
                  </p>
                  <p className="text-[#72500c] text-xs md:text-sm font-bold tracking-[0.12em] uppercase">
                    {director.title || "DIRECCIÓN GENERAL"}
                  </p>
                </div>

                <div className="w-full">
                  <div className="w-full h-px bg-[#0F213C]/10 my-4" />
                  <div className="flex items-center gap-3.5 text-[#0F213C]/80">
                    <Globe size={22} className="text-[#db5835] shrink-0" />
                    <div className="w-px h-8 bg-[#0F213C]/15 shrink-0" />
                    <p className="text-sm md:text-[16px] leading-snug text-left font-medium">
                      {director.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Departamentos */}
      <div className="space-y-16">
        {DEPARTMENTS.map((dept) => (
          <div key={dept.name} className="max-w-6xl mx-auto border-t border-[#1E1810]/5 pt-12">
            <div className="flex flex-col gap-10">
              {/* Info del departamento - Arriba y centrado */}
              <div className="text-center max-w-3xl mx-auto space-y-3.5">
                <h3 className="text-2xl font-extrabold text-[#72500c] tracking-tight">
                  {dept.name}
                </h3>
                <p className="text-[#1E1810]/75 text-base sm:text-lg leading-relaxed">
                  {dept.intro}
                </p>
              </div>

              {/* Integrantes - Abajo en grilla centrada */}
              <div className="flex flex-wrap gap-8 justify-center">
                {dept.members.map((member) => (
                  <div
                    key={member.name}
                    className="bg-[#F4F0EB] border border-[#1E1810]/5 rounded-3xl shadow-md flex flex-col overflow-hidden w-full max-w-[300px] border-b-8 border-b-[#db5835] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500 group"
                  >
                    {/* Imagen Cuadrada de perfil 1:1 (Sin zoom click) */}
                    <div className="w-full aspect-square overflow-hidden relative shrink-0">
                      <img
                        src={getImagePath(member.name)}
                        alt={member.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-102"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-[#FAF7F2] -z-10">
                        <User size={36} className="text-[#1E1810]/20" />
                      </div>
                    </div>

                    {/* Banner / Credencial abajo */}
                    <div className="p-5 flex-1 flex flex-col items-center text-center justify-between min-h-[220px]">
                      <div className="w-full space-y-1">
                        <h3 className="text-xl md:text-2xl font-extrabold font-serif text-[#0F213C] tracking-tight">
                          {member.name}
                        </h3>
                        <div className="w-8 h-0.5 bg-[#db5835] mx-auto mt-2 mb-2.5" />
                        <p className="text-[#0F213C] text-xs md:text-sm font-bold tracking-[0.15em] uppercase">
                          {member.role}
                        </p>
                        <p className="text-[#72500c] text-xs font-semibold tracking-[0.1em] uppercase">
                          {member.title || dept.name}
                        </p>
                      </div>

                      <div className="w-full">
                        <div className="w-full h-px bg-[#0F213C]/10 my-3.5" />
                        <div className="flex items-center gap-3 text-[#0F213C]/80">
                          <Globe size={18} className="text-[#db5835] shrink-0" />
                          <div className="w-px h-7 bg-[#0F213C]/15 shrink-0" />
                          <p className="text-sm md:text-[15px] leading-snug text-left font-medium">
                            {member.description ? (
                              member.description.includes("viaje") ? (
                                <>
                                  Organizo cada detalle para que tu viaje sea{" "}
                                  <span className="text-[#db5835] font-bold">perfecto desde el primer momento.</span>
                                </>
                              ) : (
                                member.description
                              )
                            ) : (
                              <>
                                Estamos para ayudarte a planificar tu{" "}
                                <span className="text-[#db5835] font-bold">próximo viaje.</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
