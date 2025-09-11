"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Container from "@/components/Container";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="py-16 text-center bg-sage-light text-sage-dark">
      <Container>
        <h1 className="max-w-screen-md mx-auto text-2xl md:text-3xl lg:text-5xl font-light mb-6">
          Explore our curated collection of high-quality PSD mockups.
        </h1>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="flex items-center border border-gray-300 bg-white px-4 py-3 shadow-md focus-within:ring-2 focus-within:ring-primary">
            <Search className="text-gray-400 w-5 h-5 mr-3" />
            <input
              type="text"
              placeholder="Search mockups, e.g., iPhone, packaging, apparel..."
              className="w-full text-base focus:outline-none bg-transparent placeholder-gray-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
