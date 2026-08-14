import { notFound } from "next/navigation";
import Link from "next/link";
import DestinationForm from "@/components/admin/DestinationForm";
import DeleteDestinationButton from "@/components/admin/DeleteDestinationButton";
import { getDbDestinations } from "@/lib/db";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDestinationPage({ params }: Props) {
  const { id } = await params;
  const numId = Number(id);

  const destinations = await getDbDestinations();
  const data = destinations.find((d) => d.id === numId);

  if (!data) notFound();

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <Link href="/admin/destinos" className="text-[#a66d03] text-xs font-bold uppercase tracking-[0.25em] hover:text-[#bf8b2a] transition-colors">
            ← Volver a destinos
          </Link>
          <h1 className="text-2xl sm:text-4xl font-black uppercase text-[#f5e6cc] tracking-wide mt-2">
            {data.title}
          </h1>
          <p className="text-white/30 text-sm mt-1 font-mono">/destinos/{data.slug}</p>
        </div>
        <DeleteDestinationButton id={data.id} slug={data.slug} />
      </div>

      <DestinationForm initial={data} id={data.id} />
    </div>
  );
}
