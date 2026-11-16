import { getDepartures, getPassengers } from "@/lib/operationsDb";
import { getOperationsSessionUser } from "@/lib/operationsAuth";
import AereosHubClient from "@/components/operaciones/AereosHubClient";

export const dynamic = "force-dynamic";

export default async function OperacionesAereosPage() {
  const [user, departures, passengers] = await Promise.all([
    getOperationsSessionUser(),
    getDepartures(),
    getPassengers(),
  ]);

  return (
    <AereosHubClient
      user={user}
      initialDepartures={departures}
      initialPassengers={passengers}
    />
  );
}

