import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import FeaturedCarousel from "./FeaturedCarousel";

export const revalidate = 60;

export interface Mockup {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string;
  categories?: string[];
  isEditable: boolean;
  downloadUrl?: string;
}

export default async function FeaturedMockups() {
  const { data, error } = await supabase
    .from("mockups")
    .select(
      "id, title, preview_url, slug, categories, is_editable, download_url"
    )
    .eq("is_featured", true)
    .eq("is_editable", true)
    .order("updated_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("Error fetching featured mockups:", error.message);
    return <p className="text-red-500">Failed to load mockups.</p>;
  }

  const mockups: Mockup[] =
    data?.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      thumbnailUrl: item.preview_url ?? "/placeholder.jpg",
      categories: item.categories,
      isEditable: item.is_editable,
      downloadUrl: item.download_url,
    })) ?? [];

  return (
    <div className="">
      <FeaturedCarousel mockups={mockups} />
    </div>
  );
}
