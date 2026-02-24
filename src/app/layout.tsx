import type { Metadata } from "next";
import { Barlow_Condensed } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Grupales Travel — Salidas Grupales Acompañadas",
  description:
    "Agencia de viajes especializada en salidas grupales acompañadas desde Argentina. Europa, América, Asia, África y más. Viajá por el mundo en grupo.",
  keywords: [
    "viajes grupales",
    "salidas grupales",
    "agencia de viajes Argentina",
    "turismo grupal",
    "Europa",
    "viajes organizados",
  ],
  openGraph: {
    title: "Grupales Travel — Salidas Grupales Acompañadas",
    description:
      "Agencia de viajes especializada en salidas grupales acompañadas desde Argentina.",
    url: "https://grupalestravel.com.ar",
    siteName: "Grupales Travel",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${barlow.variable}`}>
      <head>
        {/* Preload de la imagen fallback del hero — mejora LCP */}
        <link
          rel="preload"
          as="image"
          href="https://grupalestravel.com.ar/wp-content/uploads/2024/11/alma-europea-q2jelpfed7gmkgrwmkmavjweh1waz3cmq833kz0cm0.jpg"
          fetchPriority="high"
        />
      </head>
      <body className="antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
