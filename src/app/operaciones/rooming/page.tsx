import { getDepartures, getPassengers } from "@/lib/operationsDb";
import { getOperationsSessionUser } from "@/lib/operationsAuth";
import RoomingHubClient from "@/components/operaciones/RoomingHubClient";

export const dynamic = "force-dynamic";

export default async function OperacionesRoomingPage() {
  const [user, departures, passengers] = await Promise.all([
    getOperationsSessionUser(),
    getDepartures(),
    getPassengers(),
  ]);

  return (
    <RoomingHubClient
      user={user}
      initialDepartures={departures}
      initialPassengers={passengers}
    />
  );
}
