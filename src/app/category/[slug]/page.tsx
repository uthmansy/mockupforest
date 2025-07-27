// app/category/[slug]/page.tsx
import { Metadata } from "next";
import { supabase } from "@/lib/supabaseClient";
import GalleryGrid from "@/components/GalleryGrid";
import PaginationControls from "@/components/PaginationControls";

interface Props {
  params: { slug: string };
  searchParams: { page?: string };
}

export const revalidate = 60; // ISR: revalidates every 60s

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Category: ${params.slug.replace("-", " ")}`,
    description: `Browse ${params.slug.replace("-", " ")} mockups`,
  };
}

export default async function CategorySlugPage({
  params,
  searchParams,
}: Props) {
  const { slug } = params;
  const normalizedSlug = slug.replace(/-/g, " "); // replace all hyphens with spaces

  const page = parseInt(searchParams.page || "1", 10);
  const itemsPerPage = 24;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const { data, error, count } = await supabase
    .from("mockups")
    .select("id, title, preview_url,slug", { count: "exact" })
    .contains("categories", [normalizedSlug]) // use normalized slug here
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Supabase error:", error.message);
    return <p className="text-red-500">Failed to load category mockups.</p>;
  }

  const mockups =
    data?.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      thumbnailUrl: item.preview_url ?? "/placeholder.jpg",
    })) ?? [];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 capitalize">
        {normalizedSlug}
      </h1>

      <GalleryGrid mockups={mockups} />

      <PaginationControls
        currentPage={page}
        totalItems={count ?? 0}
        itemsPerPage={itemsPerPage}
      />
    </main>
  );
}
