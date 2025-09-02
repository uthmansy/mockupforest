// components/PaginationControls.tsx (Server Component)
import Link from "next/link";

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function PaginationControls({
  currentPage,
  totalItems,
  itemsPerPage,
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const midSize = 2;

  const pages: (number | string)[] = [];
  pages.push(1);

  if (currentPage - midSize > 2) pages.push("...");

  for (
    let i = Math.max(2, currentPage - midSize);
    i <= Math.min(totalPages - 1, currentPage + midSize);
    i++
  ) {
    pages.push(i);
  }

  if (currentPage + midSize < totalPages - 1) pages.push("...");
  if (totalPages > 1) pages.push(totalPages);

  const renderPageLink = (page: number) => {
    const href = `?page=${page}`;
    const isActive = page === currentPage;
    return (
      <Link
        key={page}
        href={href}
        className={`px-3 py-1 text-sm font-medium transition ${
          isActive
            ? "bg-primary text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        {page}
      </Link>
    );
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap justify-center items-center space-x-2 mt-10"
    >
      {/* Previous Button */}
      <Link
        href={currentPage > 1 ? `?page=${currentPage - 1}` : ""}
        className={`px-3 py-1 text-sm font-medium transition ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 pointer-events-none"
            : "bg-primary text-white hover:bg-primary-dark"
        }`}
      >
        Prev
      </Link>

      {/* Page Numbers */}
      {pages.map((p, idx) =>
        typeof p === "string" ? (
          <span key={`sep-${idx}`} className="px-3 py-1 text-gray-500">
            {p}
          </span>
        ) : (
          renderPageLink(p)
        )
      )}

      {/* Next Button */}
      <Link
        href={currentPage < totalPages ? `?page=${currentPage + 1}` : ""}
        className={`px-3 py-1 text-sm font-medium transition ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 pointer-events-none"
            : "bg-primary text-white hover:bg-primary-dark"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
