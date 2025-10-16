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
}

interface Props {
  searchParams: { page?: string };
}

export default async function MockupGallery({ searchParams }: Props) {
  const page = parseInt(searchParams.page || "1", 10);
  const itemsPerPage = 18;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // Fetch paginated mockups
  const { data, error, count } = await supabase
    .from("mockups")
    .select("id, title, preview_url, slug, categories, is_editable", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
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
