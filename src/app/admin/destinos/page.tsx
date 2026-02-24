import { getAllDestinationsAdmin } from "@/lib/supabase";
import DestinationsClient from "./DestinationsClient";

export const dynamic = "force-dynamic";

export default async function AdminDestinosPage() {
  const destinations = await getAllDestinationsAdmin().catch(() => []);

  return <DestinationsClient initialDestinations={destinations} />;
}
