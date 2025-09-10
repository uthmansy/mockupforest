import CategoriesList from "@/components/CategoriesList";
import Container from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse mockup categories",
};

export default function CategoryIndexPage() {
  return (
    <main className="py-24">
      <Container>
        <div className="max-w-max mx-auto">
          <h1 className="text-3xl mb-6 text-center">Categories</h1>
          {/* Horizontal list of categories */}
          <CategoriesList />
        </div>
      </Container>
    </main>
  );
}
