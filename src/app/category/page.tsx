import CategoriesList from "@/components/CategoriesList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse mockup categories",
};

export default function CategoryIndexPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Categories</h1>
      {/* Horizontal list of categories */}
      <CategoriesList />
    </main>
  );
}
