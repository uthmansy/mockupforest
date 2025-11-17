import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

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

export default async function RecentAdditions() {
  const { data, error } = await supabase
    .from("mockups")
    .select(
      "id, title, preview_url, slug, categories, is_editable, download_url",
      {
        count: "exact",
      }
    )
    .eq("is_editable", true)
    .order("updated_at", { ascending: false })
    .limit(15);

  if (error) {
    console.error("Error fetching mockups:", error.message);
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
      {mockups.map((item, index) => (
        <div
          key={`${item.id}${index}`}
          className="group rounded-lg overflow-hidden bg-neutral-100 relative"
        >
          {/* Image and Title */}
          <Link
            href={`${item.isEditable ? "/editor/" : "/mockups/"}${item.slug}`}
          >
            <div className="relative w-full aspect-[4/3.5] md:aspect-square rounded-lg overflow-hidden">
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 100vw"
                className="object-cover transition-transform duration-300 scale-110 group-hover:scale-125"
                quality={80}
                priority={false}
                unoptimized
              />
            </div>
            <div className="px-3 py-5">
              <h3
                className="truncate text-sm text-black uppercase mb-0 font-medium"
                title={item.title}
              >
                {item.title?.split(" ").slice(0, 6).join(" ")}
                {item.title?.split(" ").length > 6 && " ..."}
              </h3>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
