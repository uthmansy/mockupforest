import CategoriesList from "@/components/CategoriesList";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse mockup categories",
};

export default function CategoryIndexPage() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl mb-6">Categories</h1>
        {/* Horizontal list of categories */}
        <CategoriesList />
      </main>
      <Footer />
    </>
  );
}
