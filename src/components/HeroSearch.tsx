"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Container from "@/components/Container";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="bg-white">
      <Container>
        {/* Search Bar */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl uppercase leading-[1.1] text-neutral-800 text-center mb-0">
          Pro Mockups in seconds
        </h1>
        {/* <div className="">
          <Input
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            isClearable
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "bg-neutral-200",
                // "dark:bg-default/60",
                // "backdrop-blur-xl",
                // "backdrop-saturate-200",
                "hover:bg-white",
                "group-data-[focus=true]:bg-white/90",
                "cursor-text! h-16 rounded-full",
              ],
            }}
            placeholder="Type to search..."
            radius="lg"
            startContent={
              <div className="flex space-x-3 items-center">
                <Button
                  size="lg"
                  className="bg-primary text-white px-8 uppercase rounded-full"
                >
                  Search
                </Button>
                <Search className="text-gray-400 w-5 h-5 mr-3" />
              </div>
            }
          />
        </div> */}
      </Container>
    </div>
  );
}
