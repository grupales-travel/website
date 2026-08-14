"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Credenciales incorrectas");
        setLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Error de conexión. Intente nuevamente.");
      setLoading(false);
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-[#1E1810] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black uppercase text-[#f5e6cc] tracking-widest">
            Panel Admin
          </h1>
          <p className="text-white/40 text-sm mt-1">Grupales Travel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-[#d9bf8f] uppercase tracking-widest mb-1.5">
              Usuario o Email
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full bg-white/8 border border-white/15 rounded-lg px-4 py-2.5 text-white text-base outline-none focus:border-[#a66d03] transition-colors"
              required
              autoComplete="username"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#d9bf8f] uppercase tracking-widest mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white/8 border border-white/15 rounded-lg px-4 py-2.5 text-white text-base outline-none focus:border-[#a66d03] transition-colors"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full btn-gold text-white font-bold text-sm uppercase tracking-widest mt-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
