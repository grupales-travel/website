"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
  slug: string;
}

export default function DeleteDestinationButton({ id, slug }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${slug}" permanentemente?`)) return;
    setLoading(true);

    const res = await fetch(`/api/admin-destination?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/destinos");
    } else {
      const data = await res.json();
      alert(data.error ?? "Error al eliminar");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-5 py-2.5 border border-red-500/25 text-red-400 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-red-500/10 hover:border-red-500/40 transition-colors disabled:opacity-50"
    >
      {loading ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
