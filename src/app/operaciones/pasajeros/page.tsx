import { getDepartures, getPassengers } from "@/lib/operationsDb";
import { getOperationsSessionUser } from "@/lib/operationsAuth";
import PassengersListClient from "@/components/operaciones/PassengersListClient";

export const dynamic = "force-dynamic";

export default async function OperacionesPasajerosPage() {
  const [user, departures, passengers] = await Promise.all([
    getOperationsSessionUser(),
    getDepartures(),
    getPassengers(),
  ]);

  return (
    <PassengersListClient
      user={user}
      initialDepartures={departures}
      initialPassengers={passengers}
    />
  );
}
