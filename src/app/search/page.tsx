// app/search/page.tsx
import Container from "@/components/Container";
import GalleryGrid from "@/components/GalleryGrid";
import PaginationControls from "@/components/PaginationControls";
import { algoliaResponse } from "@/lib/algoliaSearch";

export interface Mockup {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string;
}

interface SearchPageProps {
  searchParams: Promise<{ query?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Await the searchParams promise
  const params = await searchParams;
  const query = params.query ?? "";
  const pageParam = parseInt(params.page ?? "1", 10);
  const itemsPerPage = 18;

  let results: Mockup[] = [];
  let totalHits = 0;
  let loading = false;

  if (query) {
    loading = true;
    try {
      const response = await algoliaResponse({
        query,
        page: pageParam - 1,
        hitsPerPage: itemsPerPage,
      });

      results = response.hits.map((hit: any) => ({
        id: hit.objectID,
        slug: hit.slug,
        title: hit.title,
        thumbnailUrl: hit.preview_url ?? "/placeholder.jpg",
      }));

      totalHits = response.nbHits ?? 0;
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
    loading = false;
  }

  return (
    <div className="py-8">
      <section className="py-5">
        <Container>
          <h1 className="text-3xl font-medium mb-10 text-center">
            Search Results: <span className="text-primary">{query}</span>
          </h1>

          {loading && <p className="text-center">Loading...</p>}

          {!loading && results.length === 0 && query && (
            <p className="text-center">No results found for "{query}".</p>
          )}

          {!loading && results.length > 0 && (
            <>
              <GalleryGrid mockups={results} />
              <PaginationControls
                currentPage={pageParam}
                totalItems={totalHits}
                itemsPerPage={itemsPerPage}
                query={query}
              />
            </>
          )}
        </Container>
      </section>
    </div>
  );
}

// This ensures the page is dynamic and not statically optimized
export const dynamic = "force-dynamic";
