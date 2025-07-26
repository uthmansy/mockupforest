import { supabase } from "@/lib/supabaseClient";
import GalleryGrid from "./GalleryGrid";
import PaginationControls from "./PaginationControls";

export const revalidate = 60;

export interface Mockup {
  id: string;
  title: string;
  thumbnailUrl: string;
}

interface Props {
  searchParams: { page?: string };
}

export default async function MockupGallery({ searchParams }: Props) {
  const page = parseInt(searchParams.page || "1", 10);
  const itemsPerPage = 24;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // Fetch paginated mockups
  const { data, error, count } = await supabase
    .from("mockups")
    .select("id, title, preview_url", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching mockups:", error.message);
    return <p className="text-red-500">Failed to load mockups.</p>;
  }

  const mockups: Mockup[] =
    data?.map((item) => ({
      id: item.id,
      title: item.title,
      thumbnailUrl: item.preview_url ?? "/placeholder.jpg",
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
