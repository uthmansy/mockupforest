import { supabase } from "@/lib/supabaseClient";
import GalleryGrid from "./GalleryGrid";
import PaginationControls from "./PaginationControls";

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

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function MockupGallery({ searchParams }: Props) {
  // THIS IS THE ONLY VERSION THAT WORKS IN NEXT.JS 16 (Dec 2025)
  console.log(searchParams);
  const pageParam = searchParams.page;
  const page = Array.isArray(pageParam)
    ? Number(pageParam[0]) || 1
    : Number(pageParam) || 1;

  const safePage = Math.max(1, page);
  const itemsPerPage = 25;
  const from = (safePage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  // Fetch paginated mockups
  const { data, error, count } = await supabase
    .from("mockups")
    .select(
      "id, title, preview_url, slug, categories, is_editable, download_url",
      {
        count: "exact",
      }
    )
    .eq("is_editable", true)
    .order("rank_score", { ascending: false })
    .range(from, to);

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
    <div className="space-y-10">
      <GalleryGrid mockups={mockups} />
      <PaginationControls
        currentPage={page}
        totalItems={count ?? 0}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
