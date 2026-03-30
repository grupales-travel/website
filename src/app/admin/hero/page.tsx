import { supabaseAdmin } from "@/lib/supabase-admin";
import { getPublicUrl } from "@/lib/r2";
import HeroImageManager from "@/components/admin/HeroImageManager";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const { data } = await supabaseAdmin
    .from("hero_images")
    .select("*")
    .order("order", { ascending: true });

  const images = (data ?? []).map((img) => ({
    id: img.id,
    storage_path: img.storage_path,
    alt: img.alt,
    order: img.order,
    active: img.active,
    publicUrl: getPublicUrl(img.storage_path),
  }));

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto">
      <HeroImageManager images={images} />
    </div>
  );
}
