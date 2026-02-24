"use client";

// Lenis eliminado — el scroll nativo del browser es más performante
// y no genera conflictos con Framer Motion en dispositivos medianos.
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
