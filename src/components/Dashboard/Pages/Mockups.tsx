"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Archive,
  Eye,
  ChevronLeft,
  ChevronRight,
  Image,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/app/stores/useAuthStore";

interface Mockup {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  categories: string[] | null;
  tags: string[] | null;
  file_type: string | null;
  file_size: string | null;
  file_dimensions: string | null;
  color_mode: string | null;
  dpi: number | null;
  author: string | null;
  license: string | null;
  views: number;
  downloads: number;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  preview_url: string | null;
  download_url: string | null;
}

function Mockups() {
  const { user } = useAuthStore();
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMockup, setSelectedMockup] = useState<Mockup | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch mockups from Supabase with search and pagination
  const fetchMockups = async (
    page: number = 1,
    search: string = "",
    category: string = "all"
  ) => {
    try {
      setLoading(true);

      // Build the query
      let query = supabase.from("mockups").select("*", { count: "exact" });

      // Apply search filter if provided
      if (search) {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`
        );
      }

      // Apply category filter if not "all"
      if (category !== "all") {
        query = query.contains("categories", [category]);
      }

      // Apply pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to).order("created_at", { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      setMockups(data || []);
      setTotalCount(count || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching mockups:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for filter dropdown
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("mockups")
        .select("categories");

      if (error) throw error;

      // Extract unique categories from all mockups
      const allCategories = Array.from(
        new Set(data?.flatMap((mockup) => mockup.categories || []) || [])
      );
      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchMockups(1, searchTerm, selectedCategory);
    fetchCategories();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMockups(1, searchTerm, selectedCategory);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  // Pagination handlers
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchMockups(newPage, searchTerm, selectedCategory);
    }
  };

  // Action handlers (same as before, but with refetch after actions)
  // const handleDelete = async (mockupId: string) => {
  //   try {
  //     setActionLoading(mockupId);

  //     // First, get the mockup data to access slug and preview_url
  //     const { data: mockupData, error: fetchError } = await supabase
  //       .from("mockups")
  //       .select("slug, preview_url")
  //       .eq("id", mockupId)
  //       .single();

  //     if (fetchError) throw fetchError;

  //     // Delete files from Supabase Storage
  //     const storageDeletions = [];

  //     // 1. Delete thumbnail if preview_url exists
  //     if (mockupData.preview_url) {
  //       // Extract the file path from the preview_url
  //       // URL format: https://[project].supabase.co/storage/v1/object/public/files/thumbnails/filename.jpg
  //       const urlParts = mockupData.preview_url.split("/");
  //       const fileName = urlParts[urlParts.length - 1];
  //       const thumbnailPath = `thumbnails/${fileName}`;

  //       storageDeletions.push(
  //         supabase.storage.from("files").remove([thumbnailPath])
  //       );
  //     }

  //     // 2. Delete the entire folder in online-mockups with the slug name
  //     if (mockupData.slug) {
  //       // List all files in the folder first
  //       const { data: folderFiles, error: listError } = await supabase.storage
  //         .from("files")
  //         .list(`online-mockups/${mockupData.slug}`);

  //       if (!listError && folderFiles && folderFiles.length > 0) {
  //         // Create an array of all file paths to delete
  //         const filesToDelete = folderFiles.map(
  //           (file) => `online-mockups/${mockupData.slug}/${file.name}`
  //         );

  //         storageDeletions.push(
  //           supabase.storage.from("files").remove(filesToDelete)
  //         );
  //       }
  //     }

  //     // Wait for all storage deletions to complete
  //     if (storageDeletions.length > 0) {
  //       const storageResults = await Promise.allSettled(storageDeletions);

  //       // Check if any storage deletions failed
  //       const storageErrors = storageResults.filter(
  //         (result) =>
  //           result.status === "rejected" ||
  //           (result.status === "fulfilled" && result.value.error)
  //       );

  //       if (storageErrors.length > 0) {
  //         console.warn("Some storage deletions failed:", storageErrors);
  //         // Continue with database deletion even if storage deletion fails
  //       }
  //     }

  //     // Finally, delete the database record
  //     const { error: deleteError } = await supabase
  //       .from("mockups")
  //       .delete()
  //       .eq("id", mockupId);

  //     if (deleteError) throw deleteError;

  //     // Refetch to update the list and pagination
  //     await fetchMockups(currentPage, searchTerm, selectedCategory);
  //     setShowDeleteModal(false);
  //     setSelectedMockup(null);
  //   } catch (error) {
  //     console.error("Error deleting mockup:", error);
  //   } finally {
  //     setActionLoading(null);
  //   }
  // };

  const handleDelete = async (mockupId: string) => {
    try {
      setActionLoading(mockupId);

      // 1️⃣ Fetch mockup data
      const { data: mockupData, error: fetchError } = await supabase
        .from("mockups")
        .select("slug, preview_url")
        .eq("id", mockupId)
        .single();

      if (fetchError) throw fetchError;

      const storageDeletions: Promise<any>[] = [];

      // 2️⃣ Delete from Cloudflare R2 (preview + folder)
      if (mockupData.preview_url || mockupData.slug) {
        try {
          const payload: any = {};

          // Single preview file
          if (mockupData.preview_url) {
            const fileName = mockupData.preview_url.split("/").pop();
            if (fileName) payload.file = `thumbnails/${fileName}`;
          }

          // Entire folder
          if (mockupData.slug) {
            payload.folder = `online-mockups/${mockupData.slug}`;
          }

          storageDeletions.push(
            fetch("https://delete-file.serve-image.workers.dev", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          );
        } catch (err) {
          console.warn("Failed to delete from Cloudflare R2:", err);
        }
      }

      // 3️⃣ Delete preview from Supabase if exists there
      if (mockupData.preview_url?.includes("supabase.co")) {
        const fileName = mockupData.preview_url.split("/").pop();
        if (fileName) {
          storageDeletions.push(
            supabase.storage.from("files").remove([`thumbnails/${fileName}`])
          );
        }
      }

      // 4️⃣ Delete folder in Supabase Storage (`online-mockups/<slug>`)
      if (mockupData.slug) {
        const { data: folderFiles, error: listError } = await supabase.storage
          .from("files")
          .list(`online-mockups/${mockupData.slug}`);

        if (!listError && folderFiles && folderFiles.length > 0) {
          const filesToDelete = folderFiles.map(
            (file) => `online-mockups/${mockupData.slug}/${file.name}`
          );
          storageDeletions.push(
            supabase.storage.from("files").remove(filesToDelete)
          );
        }
      }

      // 5️⃣ Wait for all deletions
      if (storageDeletions.length > 0) {
        const results = await Promise.allSettled(storageDeletions);
        const errors = results.filter(
          (r) =>
            r.status === "rejected" ||
            (r.status === "fulfilled" && r.value?.error)
        );
        if (errors.length > 0)
          console.warn("Some storage deletions failed:", errors);
      }

      // 6️⃣ Delete database record
      const { error: deleteError } = await supabase
        .from("mockups")
        .delete()
        .eq("id", mockupId);

      if (deleteError) throw deleteError;

      // 7️⃣ Refresh UI
      await fetchMockups(currentPage, searchTerm, selectedCategory);
      setShowDeleteModal(false);
      setSelectedMockup(null);
    } catch (error) {
      console.error("Error deleting mockup:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchive = async (mockupId: string) => {
    try {
      setActionLoading(mockupId);
      const { error } = await supabase
        .from("mockups")
        .update({ is_published: false })
        .eq("id", mockupId);

      if (error) throw error;

      // Update local state immediately for better UX
      setMockups(
        mockups.map((mockup) =>
          mockup.id === mockupId ? { ...mockup, is_published: false } : mockup
        )
      );
    } catch (error) {
      console.error("Error archiving mockup:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePublish = async (mockupId: string) => {
    try {
      setActionLoading(mockupId);
      const { error } = await supabase
        .from("mockups")
        .update({ is_published: true })
        .eq("id", mockupId);

      if (error) throw error;

      setMockups(
        mockups.map((mockup) =>
          mockup.id === mockupId ? { ...mockup, is_published: true } : mockup
        )
      );
    } catch (error) {
      console.error("Error publishing mockup:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleFeature = async (mockupId: string, featured: boolean) => {
    try {
      setActionLoading(mockupId);
      const { error } = await supabase
        .from("mockups")
        .update({ is_featured: featured })
        .eq("id", mockupId);

      if (error) throw error;

      setMockups(
        mockups.map((mockup) =>
          mockup.id === mockupId ? { ...mockup, is_featured: featured } : mockup
        )
      );
    } catch (error) {
      console.error("Error updating featured status:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async (mockup: Mockup) => {
    try {
      setActionLoading(mockup.id);

      // Update download count
      const { error } = await supabase
        .from("mockups")
        .update({ downloads: mockup.downloads + 1 })
        .eq("id", mockup.id);

      if (error) throw error;

      setMockups(
        mockups.map((m) =>
          m.id === mockup.id ? { ...m, downloads: m.downloads + 1 } : m
        )
      );

      // Trigger download
      if (mockup.download_url) {
        window.open(mockup.download_url, "_blank");
      } else {
        console.warn("No download URL available");
      }
    } catch (error) {
      console.error("Error downloading mockup:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleView = async (mockup: Mockup) => {
    try {
      // Update view count
      const { error } = await supabase
        .from("mockups")
        .update({ views: mockup.views + 1 })
        .eq("id", mockup.id);

      if (error) throw error;

      setMockups(
        mockups.map((m) =>
          m.id === mockup.id ? { ...m, views: m.views + 1 } : m
        )
      );

      // Open preview
      if (mockup.preview_url) {
        window.open(mockup.preview_url, "_blank");
      }
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && mockups.length === 0) {
    return (
      <>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mockups</h1>
          <p className="text-gray-600">Loading your mockups...</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mockups</h1>
        <p className="text-gray-600">
          Manage and organize your design mockups.{" "}
          {totalCount > 0 &&
            `Showing ${mockups.length} of ${totalCount} mockups`}
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* Search */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search mockups in database..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Items per page */}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                fetchMockups(1, searchTerm, selectedCategory);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>

            {/* Create New Button */}
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              <span>Create Mockup</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mockups Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {mockups.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedCategory !== "all"
                ? "No mockups found"
                : "No mockups yet"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first mockup."}
            </p>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors mx-auto">
              <Plus className="w-4 h-4" />
              <span>Create Mockup</span>
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mockup
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockups.map((mockup) => (
                    <tr
                      key={mockup.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {mockup.preview_url ? (
                              <img
                                src={mockup.preview_url}
                                alt={mockup.title}
                                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                onError={(e) => {
                                  // Fallback if image fails to load
                                  e.currentTarget.style.display = "none";
                                  e.currentTarget.nextElementSibling?.classList.remove(
                                    "hidden"
                                  );
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center ${
                                mockup.preview_url ? "hidden" : ""
                              }`}
                            >
                              <Image className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {mockup.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {mockup.slug}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Created {formatDate(mockup.created_at)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {mockup.views} views
                        </div>
                        <div className="text-sm text-gray-500">
                          {mockup.downloads} downloads
                        </div>
                        {mockup.dpi && (
                          <div className="text-xs text-gray-400">
                            {mockup.dpi} DPI
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              mockup.is_published
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {mockup.is_published ? "Published" : "Archived"}
                          </span>
                          {mockup.is_featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {/* View */}
                          <button
                            onClick={() => handleView(mockup)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Download */}
                          <button
                            onClick={() => handleDownload(mockup)}
                            disabled={actionLoading === mockup.id}
                            className="text-green-600 hover:text-green-900 p-1 rounded transition-colors disabled:opacity-50"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Archive/Publish */}
                          {mockup.is_published ? (
                            <button
                              onClick={() => handleArchive(mockup.id)}
                              disabled={actionLoading === mockup.id}
                              className="text-orange-600 hover:text-orange-900 p-1 rounded transition-colors disabled:opacity-50"
                              title="Archive"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePublish(mockup.id)}
                              disabled={actionLoading === mockup.id}
                              className="text-green-600 hover:text-green-900 p-1 rounded transition-colors disabled:opacity-50"
                              title="Publish"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}

                          {/* Feature/Unfeature */}
                          <button
                            onClick={() =>
                              handleFeature(mockup.id, !mockup.is_featured)
                            }
                            disabled={actionLoading === mockup.id}
                            className={`p-1 rounded transition-colors disabled:opacity-50 ${
                              mockup.is_featured
                                ? "text-yellow-600 hover:text-yellow-900"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                            title={mockup.is_featured ? "Unfeature" : "Feature"}
                          >
                            <Filter className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              setSelectedMockup(mockup);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalCount)}
                    </span>{" "}
                    of <span className="font-medium">{totalCount}</span> results
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMockup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Mockup
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "
              <strong>{selectedMockup.title}</strong>"? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedMockup(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedMockup.id)}
                disabled={actionLoading === selectedMockup.id}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {actionLoading === selectedMockup.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Mockups;
