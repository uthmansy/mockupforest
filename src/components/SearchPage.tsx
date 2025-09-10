"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import GalleryGrid from "@/components/GalleryGrid";
import PaginationControls from "@/components/PaginationControls";
import { algoliaResponse } from "@/lib/algoliaSearch";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);

  const itemsPerPage = 18;
  const [results, setResults] = useState<any[]>([]);
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

        setResults(
          response.hits.map((hit: any) => ({
            id: hit.objectID,
            slug: hit.slug,
            title: hit.title,
            thumbnailUrl: hit.preview_url ?? "/placeholder.jpg",
          }))
        );
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
    </div>
  );
}
