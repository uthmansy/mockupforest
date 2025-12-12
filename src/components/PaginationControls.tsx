// components/PaginationControls.tsx
import Link from "next/link";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  query?: string; // ✅ optional
}

export default function PaginationControls({
  currentPage,
  totalItems,
  itemsPerPage,
  query,
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

  // ✅ helper to build URLs consistently
  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  const renderPageLink = (page: number) => {
    const href = buildHref(page);
    const isActive = page === currentPage;
    return (
      <Link
        key={page}
        href={href}
        className={`md:h-12 h-10 w-12 flex items-center justify-center text-sm font-medium transition rounded-full ${
          isActive
            ? "bg-primary text-white"
            : "bg-neutral-100 text-gray-700 hover:bg-neutral-200"
        }`}
      >
        {page}
      </Link>
    );
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-nowrap justify-center items-center space-x-2 mt-10"
    >
      {/* Previous Button */}
      <Link
        href={currentPage > 1 ? buildHref(currentPage - 1) : ""}
        className={`px-4 md:h-12 h-10 flex items-center text-sm font-medium transition rounded-full group ${
          currentPage === 1
            ? "bg-neutral-200 text-gray-400 pointer-events-none"
            : "bg-primary text-white hover:bg-primary-dark"
        }`}
      >
        <BsArrowLeft className="text-xl mr-3 group-hover:mr-5 transition-all duration-150" />
        <span className="hidden sm:inline">Prev</span>
      </Link>

      {/* Page Numbers */}
      {pages.map((p, idx) =>
        typeof p === "string" ? (
          <span
            key={`sep-${idx}`}
            className="md:h-12 h-10 w-10 md:w-12 flex items-center justify-center text-gray-500"
          >
            {p}
          </span>
        ) : (
          renderPageLink(p)
        )
      )}

      {/* Next Button */}
      <Link
        href={currentPage < totalPages ? buildHref(currentPage + 1) : ""}
        className={`px-4 md:h-12 h-10 flex items-center text-sm font-medium transition rounded-full group ${
          currentPage === totalPages
            ? "bg-neutral-200 text-gray-400 pointer-events-none"
            : "bg-primary text-white hover:bg-primary-dark"
        }`}
      >
        <span className="hidden sm:inline">Next</span>
        <BsArrowRight className="text-xl ml-3 group-hover:ml-5 transition-all duration-150" />
      </Link>
    </nav>
  );
}
