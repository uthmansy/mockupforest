import CategoriesList from "@/components/CategoriesList";
import Container from "@/components/Container";
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
      <main className="py-24">
        <Container>
          <div className="max-w-max mx-auto">
            <h1 className="text-3xl mb-6 text-center">Categories</h1>
            {/* Horizontal list of categories */}
            <CategoriesList />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
