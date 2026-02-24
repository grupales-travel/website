"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Destination } from "@/types";
import { Clock, Download } from "lucide-react";

interface PartnerDestinationCardProps {
    destination: Destination;
    index?: number;
}

export default function PartnerDestinationCard({
    destination,
    index = 0,
}: PartnerDestinationCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{
                duration: 0.5,
                delay: (index % 4) * 0.05,
                ease: "easeOut",
            }}
        >
            <Link
                href={`/destinos/${destination.slug}`}
                className="group block relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#e5e5e5] hover:border-[#d9bf8f]/50"
            >
                <div className="flex flex-col h-full">
                    {/* Imagen (Aspect Ratio más panorámico/compacto) */}
                    <div className="relative aspect-[3/2] overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                            style={{
                                backgroundImage: `url('${destination.thumbnailImage || destination.heroImage
                                    }')`,
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                        {/* Badge "Partner" opcional o Región */}
                        <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[#a66d03] text-[10px] font-bold uppercase tracking-wider rounded-sm">
                                {destination.region === 'africa-mo' ? 'África & M.O.' : destination.region}
                            </span>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-4 flex flex-col justify-between flex-grow">
                        <div>
                            <h3 className="text-lg font-bold text-[#1e1810] leading-snug mb-1 group-hover:text-[#a66d03] transition-colors">
                                {destination.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-[#1e1810]/60 mb-3">
                                <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {destination.days} días
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#f0f0f0]">
                            <span className="text-[11px] font-bold text-[#a66d03] uppercase tracking-wider">
                                Ver Itinerario
                            </span>
                            <Download size={14} className="text-[#a66d03]" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
