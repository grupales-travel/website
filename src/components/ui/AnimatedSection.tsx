"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
}

const DIRECTION_MAP = {
  up:    { y: 40, x: 0 },
  down:  { y: -40, x: 0 },
  left:  { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none:  { x: 0, y: 0 },
} as const;

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.8,
}: AnimatedSectionProps) {
  const initial = useMemo(
    () => ({ opacity: 0, ...DIRECTION_MAP[direction] }),
    [direction]
  );

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
