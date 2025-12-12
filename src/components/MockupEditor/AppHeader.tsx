"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import Download from "./Download";
import SettingsPanel from "./SettingsPanel";
import { Mockup } from "@/types/db";
import { BiSolidGrid } from "react-icons/bi";

interface MockupGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAGE_SIZE = 8;

// Loading skeleton component
const MockupCardSkeleton = () => (
  <div className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-300 w-full"></div>
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

// Mockup card
const MockupCard = ({ mockup }: { mockup: any }) => (
  <Link
    href={`/editor/${mockup.slug}`}
    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer"
  >
    <div className="aspect-square bg-gray-100 relative overflow-hidden">
      {mockup.preview_url ? (
        <Image
          src={mockup.preview_url}
          alt={mockup.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
          <svg
            className="w-12 h-12 "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
    </div>
    <div className="p-3">
      <h4 className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
        {mockup.title}
      </h4>
    </div>
  </Link>
);

function MockupGallery({ isOpen, onClose }: MockupGalleryProps) {
  const [mockups, setMockups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchMockups = useCallback(async (pageNumber: number) => {
    const from = pageNumber * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from("mockups")
      .select(
        "id, title, preview_url, slug, categories, is_editable, download_url",
        { count: "exact" }
      )
      .eq("is_editable", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setMockups((prev) => [...prev, ...data]);
      if (data.length < PAGE_SIZE) setHasMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (isOpen) {
      setMockups([]);
      setPage(0);
      setHasMore(true);
      setLoading(true);
      fetchMockups(0).finally(() => setLoading(false));
    }
  }, [isOpen, fetchMockups]);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [loading, hasMore]);

  // Fetch next page when page changes
  useEffect(() => {
    if (page > 0) fetchMockups(page);
  }, [page, fetchMockups]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-20 right-6 w-[480px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[700px] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-0">
                  More Mockups!
                </h3>
                <button
                  onClick={onClose}
                  className=" hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mockups Grid */}
            <div className="p-6 overflow-y-auto max-h-[500px]">
              {loading && mockups.length === 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <MockupCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {mockups.map((mockup) => (
                    <MockupCard key={mockup.id} mockup={mockup} />
                  ))}
                  {hasMore && (
                    <div
                      ref={loaderRef}
                      className="col-span-2 text-center py-4"
                    >
                      <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface AppHeaderProps {
  glRef: any;
  user: any;
  mockupData: Mockup;
}

export default function AppHeader({ glRef, user, mockupData }: AppHeaderProps) {
  const [showMockupGallery, setShowMockupGallery] = useState(false);

  return (
    <>
      <header className="h-[3rem] bg-black">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="h-15 max-h-15 flex items-center p-3">
              <Link href="/">
                <Image
                  src="/dark-logo.png"
                  alt="MockupForest logo"
                  width={100}
                  height={20}
                  priority
                />
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center">
            {user && glRef && (
              <SettingsPanel glRef={glRef} mockupId={mockupData.id} />
            )}
            <button
              onClick={() => setShowMockupGallery(true)}
              className="bg-white/20 m-0 text-white hidden md:flex items-center justify-center h-[3rem] w-[3rem] hover:bg-white/30 cursor-pointer transition-all duration-200 group"
            >
              <BiSolidGrid className="text-xl" />
            </button>
            {/* <div className="w-px h-6 bg-white/20 mx-1" /> */}
            {glRef && <Download glRef={glRef} />}
          </div>
        </div>
      </header>

      <MockupGallery
        isOpen={showMockupGallery}
        onClose={() => setShowMockupGallery(false)}
      />
    </>
  );
}
