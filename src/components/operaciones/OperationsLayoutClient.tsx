"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { OperatorUser } from "@/types/operations";
import {
  LayoutDashboard,
  Compass,
  Users2,
  BedDouble,
  PlaneTakeoff,
  Bus,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

interface Props {
  user: OperatorUser | null;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/operaciones", label: "Panel General", icon: LayoutDashboard },
  { href: "/operaciones/salidas", label: "Salidas Grupales", icon: Compass },
  { href: "/operaciones/pasajeros", label: "Pasajeros (Pax)", icon: Users2 },
  { href: "/operaciones/rooming", label: "Rooming Inteligente", icon: BedDouble },
  { href: "/operaciones/aereos", label: "Emisión de Aéreos", icon: PlaneTakeoff },
  { href: "/operaciones/logistica", label: "Logística Pre/Post", icon: Bus },
];

export default function OperationsLayoutClient({ user, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // En la pantalla de login no mostramos el shell operativo
  if (pathname === "/operaciones/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/operaciones/auth/logout", { method: "POST" });
      router.push("/operaciones/login");
      router.refresh();
    } catch {
      router.push("/operaciones/login");
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#1b2027] text-white border-r border-white/10 select-none">
      {/* Encabezado Marca */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link href="/operaciones" className="flex items-center gap-2.5">
          <div className="relative h-9 w-28">
            <Image
              src="/logo-footer.png"
              alt="Grupales Travel"
              fill
              className="object-contain object-left"
            />
          </div>
        </Link>
        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[#ba8728]/20 text-[#dfb44f] border border-[#ba8728]/30">
          OPERACIONES
        </span>
      </div>

      {/* Usuario Activo */}
      <div className="px-5 py-4 bg-[#222832]/60 border-b border-white/5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#ba8728]/20 border border-[#ba8728]/40 flex items-center justify-center text-[#dfb44f] font-black text-xs shrink-0">
          {user?.name ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("") : "GT"}
        </div>
        <div className="overflow-hidden flex-1">
          <p className="text-sm font-bold text-white truncate leading-tight">
            {user?.name || "Operador"}
          </p>
          <p className="text-[11px] font-semibold text-[#ba8728] truncate uppercase tracking-wider">
            {user?.department || "Operaciones"} · {user?.city || "San Luis"}
          </p>
        </div>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-white/35 mb-2">
          Módulos del Sistema
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/operaciones"
              ? pathname === "/operaciones"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                isActive
                  ? "bg-gradient-to-r from-[#ba8728] to-[#c59b3f] text-white shadow-md shadow-[#ba8728]/25"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={17} className={isActive ? "text-white" : "text-[#ba8728]"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-white/10 space-y-2 bg-[#171b21]/80">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-white/50 hover:bg-white/5 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink size={14} />
            Ver Web Oficial
          </span>
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-300 text-xs font-bold uppercase tracking-wider transition-colors border border-white/5 cursor-pointer disabled:opacity-50"
        >
          <LogOut size={14} />
          <span>{loggingOut ? "Cerrando..." : "Cerrar Sesión"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#14181d] flex flex-col font-sans text-[#f0f2f5]">
      {/* Barra Superior Móvil */}
      <header className="lg:hidden bg-[#1b2027] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/operaciones" className="flex items-center gap-2">
          <div className="relative h-7 w-24">
            <Image
              src="/logo-footer.png"
              alt="Grupales Travel"
              fill
              className="object-contain object-left"
            />
          </div>
          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#ba8728]/20 text-[#dfb44f]">
            OPERACIONES
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Contenedor Principal: Sidebar Desktop + Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
          {sidebarContent}
        </aside>

        {/* Drawer Móvil */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] h-full z-10">
              {sidebarContent}
            </div>
          </div>
        )}

        {/* Área de Contenido Principal */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

