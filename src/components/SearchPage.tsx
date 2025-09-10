"use client";

import Container from "@/components/Container";
import GalleryGrid from "@/components/GalleryGrid";
import PaginationControls from "@/components/PaginationControls";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { algoliaResponse } from "@/lib/algoliaSearch";

export interface Mockup {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10); // page from URL
  const itemsPerPage = 18;

  const [results, setResults] = useState<Mockup[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setTotalHits(0);
        return;
      }

      setLoading(true);
      try {
        const response = await algoliaResponse({
          query,
          page: pageParam - 1,
          hitsPerPage: itemsPerPage,
        });

        const mappedResults = response.hits.map((hit: any) => ({
          id: hit.objectID,
          slug: hit.slug,
          title: hit.title,
          thumbnailUrl: hit.preview_url ?? "/placeholder.jpg",
        }));

        setResults(mappedResults);
        setTotalHits(response.nbHits ?? 0);
      } catch (err) {
        console.error("Error fetching search results:", err);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query, pageParam]);

  return (
    <div className="py-8">
      <section className="py-5">
        <Container>
          <h1 className="text-3xl font-medium mb-10 text-center">
            Search Results for: <span className="text-primary">{query}</span>
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
