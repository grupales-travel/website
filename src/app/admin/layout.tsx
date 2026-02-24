import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`h-screen overflow-hidden bg-[#161210] flex ${inter.className} text-white`}>

      {/* Sidebar */}
      <aside className="w-56 bg-[#1E1810] border-r border-white/10 shrink-0 flex flex-col z-10 overflow-y-auto">

        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-[#a66d03] text-[9px] font-bold uppercase tracking-widest mb-1">Panel Administrativo</p>
          <p className="text-[#f5e6cc] font-black text-base leading-tight">Grupales Travel</p>
        </div>

        <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wider px-3 pb-2">Menú Principal</p>
          {[
            { href: "/admin", label: "Inicio" },
            { href: "/admin/destinos", label: "Destinos" },
            { href: "/admin/hero", label: "Imágenes de portada" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-lg text-white/60 text-[13px] font-medium hover:bg-white/5 hover:text-white transition-colors duration-150"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-5 border-t border-white/10 flex flex-col gap-1">
          <Link href="/" target="_blank"
            className="px-3 py-2 rounded-lg text-white/40 text-[13px] font-medium hover:bg-white/5 hover:text-white transition-colors duration-150">
            Ver sitio web
          </Link>
          <Link href="/api/admin-logout"
            className="px-3 py-2 rounded-lg text-red-400/70 text-[13px] font-medium hover:bg-red-500/10 hover:text-red-400 transition-colors duration-150">
            Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-y-auto bg-[#161210] relative">
        {children}
      </main>
    </div>
  );
}
