"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import { Menu, X } from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";

const inter = Inter({ subsets: ["latin"] });

const NAV_ITEMS = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/destinos", label: "Destinos" },
  { href: "/admin/hero", label: "Imágenes de portada" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login page: render children without any admin chrome
  if (isLogin) {
    return <div className={`${inter.className} text-white`}>{children}</div>;
  }

  const sidebarContent = (
    <>
      <div className="px-5 py-6 border-b border-white/10">
        <p className="text-[#a66d03] text-[9px] font-bold uppercase tracking-widest mb-1">Panel Administrativo</p>
        <p className="text-[#f5e6cc] font-black text-base leading-tight">Grupales Travel</p>
      </div>

      <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wider px-3 pb-2">Menú Principal</p>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
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
        <LogoutButton />
      </div>
    </>
  );

  return (
    <div className={`h-screen overflow-hidden bg-[#161210] flex ${inter.className} text-white`}>

      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-56 bg-[#1E1810] border-r border-white/10 shrink-0 flex-col z-10 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile header + drawer */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#1E1810] border-b border-white/10 shrink-0">
          <div>
            <p className="text-[#a66d03] text-[8px] font-bold uppercase tracking-widest">Panel Admin</p>
            <p className="text-[#f5e6cc] font-black text-sm leading-tight">Grupales Travel</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-white/60 hover:bg-white/10 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[#1E1810] border-r border-white/10 z-50 flex flex-col overflow-y-auto lg:hidden">
              {sidebarContent}
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-[#161210] relative">
          {children}
        </main>
      </div>
    </div>
  );
}
