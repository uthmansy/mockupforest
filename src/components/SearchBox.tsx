"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search mockups..."
        className="pl-10 pr-4 py-2 w-64 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl ">
        <CiSearch />
      </span>
    </div>
  );
}
