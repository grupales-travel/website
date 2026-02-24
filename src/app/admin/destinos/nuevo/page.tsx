import Link from "next/link";
import DestinationForm from "@/components/admin/DestinationForm";

export default function NewDestinationPage() {
  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/admin/destinos" className="text-[#a66d03] text-xs font-bold uppercase tracking-[0.25em] hover:text-[#bf8b2a] transition-colors">
            ← Volver a destinos
          </Link>
          <h1 className="text-4xl font-black uppercase text-[#f5e6cc] tracking-wide mt-2">
            Nuevo destino
          </h1>
          <p className="text-white/30 text-sm mt-1">Completá los datos del nuevo destino.</p>
        </div>
      </div>

      <DestinationForm />
    </div>
  );
}
