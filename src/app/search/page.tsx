export const dynamic = "force-dynamic"; // ⬅️ prevent build-time prerender

import SearchPage from "@/components/SearchPage";
import { Suspense } from "react";

export default function Search() {
  return (
    <Suspense fallback={<p className="text-center py-10">Loading search...</p>}>
      <SearchPage />
    </Suspense>
  );
}
