import { notFound } from "next/navigation";
import { getDepartureById, getPassengersByDeparture, getDepartures, getPassengers } from "@/lib/operationsDb";
import { getOperationsSessionUser } from "@/lib/operationsAuth";
import DepartureDetailClient from "@/components/operaciones/DepartureDetailClient";

export const dynamic = "force-dynamic";

export default async function OperacionesSalidaDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;

  const [user, departure, passengers, allDepartures, allPassengers] = await Promise.all([
    getOperationsSessionUser(),
    getDepartureById(id),
    getPassengersByDeparture(id),
    getDepartures(),
    getPassengers(),
  ]);

  if (!departure) {
    notFound();
  }

  return (
    <DepartureDetailClient
      user={user}
      departure={departure}
      initialPassengers={passengers}
      allDepartures={allDepartures}
      allPassengers={allPassengers}
      initialTab={tab || "pasajeros"}
    />
  );
}
