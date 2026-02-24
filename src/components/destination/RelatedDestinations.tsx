import { Destination } from "@/types";
import { DESTINATIONS } from "@/data/destinations";
import DestinationCard from "@/components/home/DestinationCard";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface Props {
  current: Destination;
  allDestinations?: Destination[];
}

export default function RelatedDestinations({ current, allDestinations }: Props) {
  const source = allDestinations ?? DESTINATIONS;
  const related = source.filter(
    (d) => d.active && d.id !== current.id && d.year === current.year
  ).slice(0, 4);

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
      </div>
    </section>
  );
}
