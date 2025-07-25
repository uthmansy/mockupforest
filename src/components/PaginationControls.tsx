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

  const renderLink = (page: number, label: string, disabled: boolean) => {
    const href = page > 1 ? `?page=${page}` : "/";
    return (
      <Link
        href={href}
        className={
          `px-4 py-2 rounded-lg font-medium transition ` +
          (disabled
            ? "bg-gray-200 text-gray-500 pointer-events-none"
            : "bg-primary text-white hover:bg-primary-dark")
        }
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="flex justify-center items-center mt-10 space-x-4">
      {renderLink(currentPage - 1, "Previous", currentPage === 1)}
      <span className="text-gray-700 font-medium">
        Page {currentPage} of {totalPages}
      </span>
      {renderLink(currentPage + 1, "Next", currentPage === totalPages)}
    </div>
  );
}
