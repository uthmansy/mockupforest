import React, { useEffect, useState, useCallback } from "react";
import { Mockup } from "@/types/db";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Badge,
  Slider,
  Pagination,
} from "@heroui/react";
import { FiEye } from "react-icons/fi";
import { getMockups, useDebouncedUpdate } from "@/helpers/functions";
import { Image } from "@heroui/react";
import NextImage from "next/image";

// Define column interface for type safety
interface Column {
  name: string;
  uid: keyof Mockup | "scores" | "actions" | "thumbnail";
}

export const columns: Column[] = [
  { name: "THUMBNAIL", uid: "thumbnail" },
  // { name: "TITLE", uid: "title" },
  { name: "CATEGORIES", uid: "categories" },
  { name: "SCORES", uid: "scores" },
  { name: "ACTIONS", uid: "actions" },
];

// Helper function to safely render any value as ReactNode
const renderValueAsReactNode = (value: any): React.ReactNode => {
  if (value === null || value === undefined) {
    return "-";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    // For JSON objects, show a placeholder or nothing
    return <span className="text-xs text-default-400">[Object]</span>;
  }

  return String(value);
};

export default function MockupsTable() {
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const debouncedUpdate = useDebouncedUpdate();

  useEffect(() => {
    const loadMockups = async () => {
      try {
        setIsLoading(true);
        const data = await getMockups(page);
        setMockups(data.mockups);
        setPages(data.count);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load mockups");
        console.error("Error loading mockups:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadMockups();
  }, [page]);

  const renderCell = useCallback(
    (mockup: Mockup, columnKey: string): React.ReactNode => {
      switch (columnKey) {
        case "thumbnail":
          return (
            <div className="flex flex-col">
              <Image
                alt="HeroUI hero Image"
                as={NextImage}
                height={100}
                src={mockup.preview_url || ""}
                width={100}
                className="object-cover cursor-pointer"
              />
            </div>
          );
        case "title":
          return (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p className="text-bold text-sm capitalize truncate max-w-[200px]">
                  {mockup.title}
                </p>
                {mockup.is_featured && (
                  <Badge color="warning" variant="flat" size="sm">
                    Featured
                  </Badge>
                )}
                {!mockup.is_published && (
                  <Badge color="danger" variant="flat" size="sm">
                    Draft
                  </Badge>
                )}
              </div>
            </div>
          );

        case "categories":
          return (
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap gap-1">
                {mockup.categories?.map((category: string, index: number) => (
                  <Chip key={index} size="sm" variant="flat" color="primary">
                    {category}
                  </Chip>
                ))}
              </div>
              {mockup.tags && mockup.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {mockup.tags.slice(0, 3).map((tag: string, index: number) => (
                    <Chip
                      key={index}
                      size="sm"
                      variant="bordered"
                      className="text-xs"
                    >
                      {tag}
                    </Chip>
                  ))}
                  {mockup.tags.length > 3 && (
                    <Chip size="sm" variant="bordered" className="text-xs">
                      +{mockup.tags.length - 3}
                    </Chip>
                  )}
                </div>
              )}
            </div>
          );

        case "scores":
          return (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Chip
                  size="sm"
                  variant="flat"
                  color={
                    mockup.rank_score && mockup.rank_score > 80
                      ? "success"
                      : "warning"
                  }
                >
                  Rank: {mockup.rank_score?.toFixed(1) || "N/A"}
                </Chip>
              </div>
              <div className="flex gap-2">
                {mockup.curated_score !== undefined && (
                  <Tooltip content="Curated Score">
                    <Chip
                      size="sm"
                      variant="flat"
                      className="text-xs min-w-[40px] text-center"
                    >
                      C:{mockup.curated_score}
                    </Chip>
                  </Tooltip>
                )}
                {mockup.recency_score !== undefined && (
                  <Tooltip content="Recency Score">
                    <Chip
                      size="sm"
                      variant="flat"
                      className="text-xs min-w-[40px] text-center"
                    >
                      R:{mockup.recency_score?.toFixed(1)}
                    </Chip>
                  </Tooltip>
                )}
                {mockup.randomness_score !== undefined && (
                  <Tooltip content="Randomness Score">
                    <Chip
                      size="sm"
                      variant="flat"
                      className="text-xs min-w-[40px] text-center"
                    >
                      RN:{mockup.randomness_score?.toFixed(1)}
                    </Chip>
                  </Tooltip>
                )}
              </div>
            </div>
          );

        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Preview mockup">
                <button
                  className="text-lg text-default-400 cursor-pointer active:opacity-50 hover:text-primary transition-colors"
                  onClick={() => {
                    // Handle preview click
                    console.log("Preview mockup:", mockup.id);
                  }}
                  aria-label={`Preview ${mockup.title}`}
                >
                  <FiEye />
                </button>
              </Tooltip>
              <div className="min-w-sm">
                <Slider
                  key={mockup.id}
                  aria-label="Temperature"
                  className="max-w-md w-full"
                  color="foreground"
                  defaultValue={mockup.curated_score || 0}
                  maxValue={10}
                  minValue={0}
                  showOutline={true}
                  size="sm"
                  step={1}
                  onChange={(val) => {
                    debouncedUpdate(mockup.id, val);
                  }}
                />
              </div>
            </div>
          );

        default:
          // For any other column keys that are actual properties of Mockup
          const value = mockup[columnKey as keyof Mockup];
          return renderValueAsReactNode(value);
      }
    },
    []
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3">Loading mockups...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-danger">
        <p>Error loading mockups</p>
        <p className="text-sm text-default-500">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-600 transition-colors"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (mockups.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <p className="text-lg text-default-500">No mockups found</p>
        <p className="text-sm text-default-400">
          Create your first mockup to get started
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table
        aria-label="Mockups table"
        className="min-w-full"
        classNames={{
          base: "max-h-[520px]",
          wrapper: "rounded-lg border border-default-200",
          th: "bg-default-50 text-default-600 font-semibold",
          tr: "hover:bg-default-50 transition-colors",
        }}
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages || 0}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column: Column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={["title", "rank_score"].includes(column.uid)}
              className="px-4 py-3"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={mockups} emptyContent="No mockups found">
          {(item: Mockup) => (
            <TableRow
              key={item.id}
              className="border-b border-default-100 last:border-b-0"
            >
              {(columnKey) => (
                <TableCell className="px-4 py-3">
                  {renderCell(item, columnKey as string)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Optional: Add pagination info */}
      <div className="flex justify-between items-center mt-4 px-4 py-2 text-sm text-default-500">
        <span>Showing {mockups.length} mockups</span>
        {mockups.length > 0 && (
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border border-default-300 hover:bg-default-50">
              Previous
            </button>
            <button className="px-3 py-1 rounded border border-default-300 hover:bg-default-50">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
