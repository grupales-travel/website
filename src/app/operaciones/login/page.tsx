"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

const TEAM_QUICK_ACCESS = [
  { username: "matias", name: "Matías Amoroso", role: "Sistemas & Operaciones (Acceso Total)", city: "San Luis" },
  { username: "andres", name: "Andrés Arellano", role: "Dirección General", city: "San Luis" },
  { username: "marina", name: "Marina Mendoza", role: "Dirección General", city: "San Luis" },
  { username: "nicolas", name: "Nicolás Sánchez", role: "Administración & Operaciones", city: "San Luis" },
  { username: "luz", name: "Luz Sosa", role: "Administración & Operaciones", city: "San Luis" },
  { username: "abel", name: "Abel López", role: "Ventas & Operaciones", city: "San Luis" },
  { username: "ramiro", name: "Ramiro Ferreras Ribes", role: "Ventas & Operaciones", city: "San Luis" },
  { username: "patricia", name: "Patricia Maluzan", role: "Ventas & Operaciones", city: "San Luis" },
];

export default function OperacionesLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/operaciones/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Credenciales inválidas");
        setLoading(false);
        return;
      }

      // Login exitoso -> redirigir al portal operativo
      router.push("/operaciones");
      router.refresh();
    } catch {
      setError("Error de conexión con el servidor. Intente nuevamente.");
      setLoading(false);
    }
  };

  const selectTeamMember = (u: string) => {
    setUsername(u);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#171b21] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-white font-sans">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(186,135,40,0.12),transparent)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ba8728] via-[#dfb44f] to-[#ba8728]" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo & Marca */}
        <div className="text-center mb-8">
          <div className="relative h-14 w-52 mx-auto mb-4">
            <Image
              src="/logo-footer.png"
              alt="Grupales Travel"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ba8728]/15 border border-[#ba8728]/30 text-[#dfb44f] text-[11px] font-bold uppercase tracking-widest mb-2">
            <ShieldCheck size={14} className="text-[#ba8728]" />
            Portal Operativo Interno
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">
            Base de Datos Operativa
          </h1>
          <p className="text-white/60 text-xs mt-1">
            Gestión centralizada de salidas, pasajeros, rooming y aéreos
          </p>
        </div>

        {/* Card Formulario */}
        <div className="bg-[#1f242c] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#dfb44f] mb-1.5">
                Usuario / Integrante
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-white/40">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="ej: nicolas, andres, ramiro..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                  className="w-full bg-[#171b21] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ba8728] focus:ring-1 focus:ring-[#ba8728]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#dfb44f]">
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#171b21] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ba8728] focus:ring-1 focus:ring-[#ba8728]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-[#ba8728] via-[#c59b3f] to-[#ba8728] hover:opacity-95 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#ba8728]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  Ingresar al Sistema
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Accesos Rápidos de Integrantes */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 text-center mb-3">
              O seleccioná tu usuario para acceso rápido
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center max-h-36 overflow-y-auto pr-1">
              {TEAM_QUICK_ACCESS.map((member) => (
                <button
                  key={member.username}
                  type="button"
                  onClick={() => selectTeamMember(member.username)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all border ${
                    username === member.username
                      ? "bg-[#ba8728] text-white border-[#ba8728]"
                      : "bg-[#171b21] text-white/70 border-white/10 hover:border-[#ba8728]/50 hover:text-white"
                  }`}
                >
                  {member.name.split(" ")[0]} ({member.role})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pie de página */}
        <p className="text-center text-white/30 text-xs mt-6">
          Grupales Travel · Sistema de Gestión de Operaciones & Salidas
        </p>
      </div>
    </div>
  );
}

