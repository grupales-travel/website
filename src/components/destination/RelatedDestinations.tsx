import { Destination } from "@/types";
import { DESTINATIONS } from "@/data/destinations";
import DestinationCard from "@/components/home/DestinationCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Link from "next/link";

interface Props {
  current: Destination;
  allDestinations?: Destination[];
}

// Meses en español → índice (0=enero)
const MONTH_ES: Record<string, number> = {
  ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
  jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
};

function parseDepartureDate(dateStr: string, year: number): Date {
  const match = dateStr.toLowerCase().match(/(\d{1,2})\s+([a-záéíóú]{3})/);
  if (match) {
    const day = parseInt(match[1]);
    const month = MONTH_ES[match[2].substring(0, 3)];
    if (month !== undefined) return new Date(year, month, day);
  }
  return new Date(year, 11, 31);
}

export default function RelatedDestinations({ current, allDestinations }: Props) {
  const source = allDestinations ?? DESTINATIONS.filter(d => !d.partner || d.featured);

  // Filtra activos de la misma región, excluyendo el actual y los agotados
  const candidates = source.filter(
    (d) => d.active && d.id !== current.id && d.badge !== "agotado" && d.region === current.region
  );

  // Ordena por fecha de salida ascendente (más cercanas primero)
  const related = [...candidates]
    .sort((a, b) => {
      const dateA = parseDepartureDate(a.departureDate, a.year);
      const dateB = parseDepartureDate(b.departureDate, b.year);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-[#f5e6cc]/30">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-[#a66d03]" />
          <span className="text-[#a66d03] text-xs font-bold uppercase tracking-[0.3em]">
            Seguí explorando
          </span>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase text-[#5c3317] leading-tight">
            Otros destinos{" "}
            <span className="text-gold-gradient">que te pueden interesar</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {related.map((dest, i) => (
            <DestinationCard key={dest.id} destination={dest} index={i} />
          ))}
        </div>

        {/* Botón Ver más salidas */}
        <div className="flex justify-center mt-12">
          <Link href="/salidas" className="group flex flex-col items-center gap-2">
            <span className="inline-flex items-center gap-3 px-8 py-4 btn-gold text-white rounded-full font-bold uppercase tracking-widest text-sm shadow-lg shadow-[#a66d03]/20">
              Ver más salidas
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
