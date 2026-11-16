import { getDepartures, getPassengers } from "@/lib/operationsDb";
import { getOperationsSessionUser } from "@/lib/operationsAuth";
import SalidasListClient from "@/components/operaciones/SalidasListClient";

export const dynamic = "force-dynamic";

export default async function OperacionesSalidasPage() {
  const [user, departures, passengers] = await Promise.all([
    getOperationsSessionUser(),
    getDepartures(),
    getPassengers(),
  ]);

  return (
    <SalidasListClient
      user={user}
      initialDepartures={departures}
      initialPassengers={passengers}
    />
  );
}
