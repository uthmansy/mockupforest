// app/category/[slug]/page.tsx
import { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import PaginationControls from "@/components/PaginationControls";

interface Props {
  params: { slug: string };
  searchParams: { page?: string };
}

// Simulate 48 total mockups for each category
const TOTAL_MOCKUPS = 48;
const simulateCategoryMockups = (slug: string) =>
  Array.from({ length: TOTAL_MOCKUPS }, (_, i) => ({
    id: `${slug}-${i + 1}`,
    title: `${slug.replace("-", " ")} Mockup #${i + 1}`,
    thumbnailUrl: `https://plus.unsplash.com/premium_photo-1722945721378-1c565f10859d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
  }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Category: ${params.slug}`,
    description: `Browse ${params.slug.replace("-", " ")} mockups`,
  };
}

export default function CategorySlugPage({ params, searchParams }: Props) {
  const { slug } = params;
  const page = parseInt(searchParams.page || "1", 10);
  const itemsPerPage = 24;

  // Full dataset
  const allMockups = simulateCategoryMockups(slug);

  // Paginated slice
  const start = (page - 1) * itemsPerPage;
  const paginated = allMockups.slice(start, start + itemsPerPage);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 capitalize">
        {slug.replace("-", " ")}
      </h1>

      {/* Grid of items */}
      <GalleryGrid mockups={paginated} />

      {/* Pagination controls below the grid */}
      <PaginationControls
        currentPage={page}
        totalItems={allMockups.length}
        itemsPerPage={itemsPerPage}
      />
    </main>
  );
}
