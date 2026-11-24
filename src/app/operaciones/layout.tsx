import { getOperationsSessionUser } from "@/lib/operationsAuth";
import OperationsLayoutClient from "@/components/operaciones/OperationsLayoutClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portal Operativo | Grupales Travel",
  description: "Base de datos y gestión operativa de salidas grupales, pasajeros, rooming y aéreos.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OperacionesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOperationsSessionUser();

  return (
    <OperationsLayoutClient user={user}>
      {children}
    </OperationsLayoutClient>
  );
}

