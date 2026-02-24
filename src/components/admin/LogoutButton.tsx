"use client";

import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function LogoutButton() {
  async function handleLogout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-3 py-2 rounded-lg text-red-400/70 text-[13px] font-medium hover:bg-red-500/10 hover:text-red-400 transition-colors duration-150"
    >
      Cerrar sesión
    </button>
  );
}
