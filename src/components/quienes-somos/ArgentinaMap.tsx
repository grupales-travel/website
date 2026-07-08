"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin } from "lucide-react";

interface OfficeMarker {
  id: string;
  name: string;
  province: string;
  x: number;
  y: number;
  address: string;
}

const MARKERS: OfficeMarker[] = [
  {
    id: "san-luis",
    name: "San Luis Capital",
    province: "San Luis",
    x: 261.2,
    y: 632.5,
    address: "Pringles 335",
  },
  {
    id: "villa-mercedes",
    name: "Villa Mercedes",
    province: "San Luis",
    x: 263.2,
    y: 635.8,
    address: "General Paz 560",
  },
  {
    id: "cordoba",
    name: "Córdoba Capital",
    province: "Córdoba",
    x: 266.5,
    y: 627.5,
    address: "La Rioja 590, Of. 14",
  },
];

export default function ArgentinaMap() {
  const [hoveredMarker, setHoveredMarker] = useState<OfficeMarker | null>(null);

  return (
    <div className="relative w-full max-w-lg mx-auto bg-white/50 border border-[#a66d03]/15 rounded-2xl p-6 backdrop-blur-sm shadow-lg">
      <div className="text-center mb-6">
        <h4 className="text-sm font-bold uppercase tracking-widest text-[#a66d03] mb-1">
          Nuestra Presencia
        </h4>
        <p className="text-[#1E1810]/60 text-xs">
          Oficinas activas en el centro del país
        </p>
      </div>

      <div className="relative aspect-[3/4] w-full flex items-center justify-center">
        {/* Argentina Map SVG */}
        <svg
          viewBox="235 590 55 110"
          className="w-full h-full text-[#1E1810]/5 fill-current transition-colors duration-500"
          style={{ maxHeight: "400px" }}
        >
          {/* Main Map Path */}
          <motion.path
            d="M279.05,600.613l1.677,1.571l-6.371,9.467l-2.239,2.479l0.777,10.813l4.918,5.974l-4.132,7.209l-3.129,1.35h-3.579l1.003,5.627l-5.593,1.92l1.34,4.729l-3.354,10.701l4.141,3.38l-2.239,5.515l-3.804,5.975l2.014,4.165l-4.918,0.786l-4.028-4.951l-0.674-15.432l-6.258-26.209l1.893-9.163l-4.028-11.713l2.68-15.204l2.463-2.931l-0.605-2.222l3.164-2.888l7.054,0.483l3.942,4.21l4.555,0.078l4.668,2.853l-1.375,3.217l0.329,3.25l6.612-0.312L279.05,600.613L279.05,600.613z"
            className="fill-[#F3EFE7] stroke-[#a66d03]/25 stroke-[0.3]"
            whileHover={{ fill: "#FAF7F2", stroke: "rgba(166, 109, 3, 0.4)" }}
            transition={{ duration: 0.3 }}
          />

          {/* Tierra del Fuego Map Path */}
          <motion.path
            d="M264.745,687.564l0.225,4.951l3.803-0.337l3.242-2.144l-5.48-1.124L264.745,687.564L264.745,687.564z"
            className="fill-[#F3EFE7] stroke-[#a66d03]/25 stroke-[0.3]"
            whileHover={{ fill: "#FAF7F2", stroke: "rgba(166, 109, 3, 0.4)" }}
            transition={{ duration: 0.3 }}
          />

          {/* Glowing Markers */}
          {MARKERS.map((marker) => (
            <g
              key={marker.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredMarker(marker)}
              onMouseLeave={() => setHoveredMarker(null)}
              onClick={() => {
                const element = document.getElementById(`office-${marker.id}`);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "center" });
                  element.classList.add("ring-2", "ring-[#bf8b2a]", "ring-offset-2", "ring-offset-white");
                  setTimeout(() => {
                    element.classList.remove("ring-2", "ring-[#bf8b2a]", "ring-offset-2", "ring-offset-white");
                  }, 2000);
                }
              }}
            >
              {/* Outer pulse animation */}
              <circle cx={marker.x} cy={marker.y} r={0.7} className="fill-[#bf8b2a]/10">
                <animate
                  attributeName="r"
                  values="0.5;2;0.5"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="1;0;1"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Inner solid marker dot */}
              <circle
                cx={marker.x}
                cy={marker.y}
                r={0.5}
                className="fill-[#bf8b2a] stroke-[#FAF7F2] stroke-[0.1] shadow-lg"
              />
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredMarker && (
          <div className="absolute bg-white border border-[#a66d03]/25 rounded-xl p-3 shadow-2xl z-20 text-left pointer-events-none max-w-xs animate-fade-in transition-all duration-200">
            <div className="flex items-center gap-1.5 mb-0.5">
              <MapPin size={12} className="text-[#bf8b2a]" />
              <p className="text-[#1E1810] font-bold text-xs">
                {hoveredMarker.name}
              </p>
            </div>
            <p className="text-[#1E1810]/40 text-[10px] uppercase tracking-wider font-semibold">
              {hoveredMarker.province}
            </p>
            <p className="text-[#1E1810]/70 text-xs mt-1 border-t border-[#1E1810]/10 pt-1">
              📍 {hoveredMarker.address}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-4 border-t border-[#1E1810]/10 pt-4">
        {MARKERS.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-1.5 text-xs text-[#1E1810]/75 hover:text-[#a66d03] cursor-pointer transition-colors duration-200"
            onMouseEnter={() => setHoveredMarker(m)}
            onMouseLeave={() => setHoveredMarker(null)}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#bf8b2a]" />
            <span>{m.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
