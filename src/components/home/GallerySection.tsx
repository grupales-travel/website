"use client";

import { motion } from "framer-motion";

const PHOTOS = [
  { src: "/testimonios/testimonio-1.webp", alt: "Testimonio 1" },
  { src: "/testimonios/testimonio-2.webp", alt: "Testimonio 2" },
  { src: "/testimonios/testimonio-3.webp", alt: "Testimonio 3" },
  { src: "/testimonios/testimonio-4.png", alt: "Testimonio 4" },
  { src: "/testimonios/testimonio-5.png", alt: "Testimonio 5" },
  { src: "/testimonios/testimonio-7.png", alt: "Testimonio 7" },
  { src: "/testimonios/testimonio-8.png", alt: "Testimonio 8" },
  { src: "/testimonios/testimonio-9.png", alt: "Testimonio 9" },
  { src: "/testimonios/testimonio-10.png", alt: "Testimonio 10" },
  { src: "/testimonios/testimonio-11.png", alt: "Testimonio 11" },
  { src: "/testimonios/testimonio-12.png", alt: "Testimonio 12" },
  { src: "/testimonios/testimonio-13.png", alt: "Testimonio 13" },
  { src: "/testimonios/testimonio-14.png", alt: "Testimonio 14" },
  { src: "/testimonios/testimonio-15.png", alt: "Testimonio 15" },
  { src: "/testimonios/testimonio-16.png", alt: "Testimonio 16" },
  { src: "/testimonios/testimonio-17.png", alt: "Testimonio 17" },
];

const ITEM_SIZE = 280;
const GAP = 16; // gap-4 = 1rem = 16px

const row1 = PHOTOS.slice(0, 8);
const row2 = PHOTOS.slice(8, 16);

function MarqueeRow({
  photos,
  direction,
}: {
  photos: typeof PHOTOS;
  direction: "left" | "right";
}) {
  const items = [...photos, ...photos, ...photos];
  const setWidth = photos.length * ITEM_SIZE + photos.length * GAP;

  return (
    <div className="overflow-hidden">
      <div
        className={direction === "left" ? "marquee-track" : "marquee-track-reverse"}
        style={{ width: setWidth * 3 }}
      >
        <div className="flex gap-4">
          {items.map((photo, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-2xl overflow-hidden"
              style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat bg-[#d9bf8f]"
                style={{ backgroundImage: `url('${photo.src}')` }}
                role="img"
                aria-label={photo.alt}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GallerySection() {
  return (
    <section className="py-24 md:py-28 bg-[#f2f2f2] overflow-hidden">

      {/* Header */}
      <div className="px-6 max-w-7xl mx-auto mb-14 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="h-px w-10 bg-[#a66d03]" />
          <span className="text-[#a66d03] text-xs font-bold uppercase tracking-[0.3em]">
            Nuestros viajeros
          </span>
          <div className="h-px w-10 bg-[#a66d03]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-black uppercase text-[#5c3317] leading-tight"
        >
          La experiencia{" "}
          <span className="text-gold-gradient">lo es todo</span>
        </motion.h2>
      </div>

      <div className="flex flex-col gap-4">
        <MarqueeRow photos={row1} direction="left" />
        <MarqueeRow photos={row2} direction="right" />
      </div>
    </section>
  );
}
