import { getDepartures, getPassengers } from "@/lib/operationsDb";
import { getOperationsSessionUser } from "@/lib/operationsAuth";
import OperationsDashboardClient from "@/components/operaciones/OperationsDashboardClient";

export const dynamic = "force-dynamic";

export default async function OperacionesPage() {
  const [user, departures, passengers] = await Promise.all([
    getOperationsSessionUser(),
    getDepartures(),
    getPassengers(),
  ]);

  return (
    <OperationsDashboardClient
      user={user}
      initialDepartures={departures}
      initialPassengers={passengers}
    />
  );
}

