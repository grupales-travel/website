"use client";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-3 py-2 rounded-lg text-red-400/70 text-[13px] font-medium hover:bg-red-500/10 hover:text-red-400 transition-colors duration-150 cursor-pointer"
    >
      Cerrar sesión
    </button>
  );
}
