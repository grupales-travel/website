import Link from "next/link";
import { getAllDestinationsAdmin } from "@/lib/supabase";

export default async function AdminInicio() {
  const destinations = await getAllDestinationsAdmin().catch(() => []);

  const stats = [
    { label: "Total",      value: destinations.length },
    { label: "Activos",    value: destinations.filter((d) => d.active).length },
    { label: "Destacados", value: destinations.filter((d) => d.featured).length },
    { label: "Partner",    value: destinations.filter((d) => d.partner).length },
  ];

  return (
    <div className="p-10">

      <div className="mb-10">
        <p className="text-[#a66d03] text-xs font-bold uppercase tracking-[0.25em] mb-2">Panel de administración</p>
        <h1 className="text-4xl font-black uppercase text-[#f5e6cc] tracking-wide">Inicio</h1>
        <p className="text-white/35 text-lg mt-2">Resumen general del contenido del sitio.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/8 rounded-2xl p-6">
            <p className="text-5xl font-black text-[#a66d03] leading-none">{s.value}</p>
            <p className="text-sm font-bold text-white/35 uppercase tracking-widest mt-3">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div>
        <p className="text-white/25 text-xs font-bold uppercase tracking-[0.2em] mb-4">Accesos rápidos</p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/admin/destinos"
            className="px-7 py-3.5 bg-white/8 border border-white/10 text-[#f5e6cc] text-sm font-bold uppercase tracking-widest rounded-full hover:bg-white/12 hover:border-white/20 transition-all duration-200">
            Ver destinos
          </Link>
          <Link href="/admin/destinos/nuevo"
            className="px-7 py-3.5 btn-gold text-white text-sm font-bold uppercase tracking-widest rounded-full">
            Agregar destino
          </Link>
          <Link href="/admin/hero"
            className="px-7 py-3.5 bg-white/8 border border-white/10 text-[#f5e6cc] text-sm font-bold uppercase tracking-widest rounded-full hover:bg-white/12 hover:border-white/20 transition-all duration-200">
            Imágenes de portada
          </Link>
        </div>
      </div>

    </div>
  );
}
