import { getDepartures, getPassengers } from "@/lib/operationsDb";
import { getOperationsSessionUser } from "@/lib/operationsAuth";
import LogisticaHubClient from "@/components/operaciones/LogisticaHubClient";

export const dynamic = "force-dynamic";

export default async function OperacionesLogisticaPage() {
  const [user, departures, passengers] = await Promise.all([
    getOperationsSessionUser(),
    getDepartures(),
    getPassengers(),
  ]);

  return (
    <LogisticaHubClient
      user={user}
      initialDepartures={departures}
      initialPassengers={passengers}
    />
  );
}

