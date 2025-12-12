// app/category/[slug]/page.tsx
import { Metadata } from "next";
import { supabase } from "@/lib/supabaseClient";
import GalleryGrid from "@/components/GalleryGrid";
import PaginationControls from "@/components/PaginationControls";
import Container from "@/components/Container";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoriesList from "@/components/CategoriesList";

interface Props {
  params: { slug: string };
  searchParams: { page?: string };
}

export const revalidate = 60; // ISR: revalidates every 60s

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Category: ${params.slug.replace("-", " ")}`,
    description: `Browse ${params.slug.replace("-", " ")} mockups`,
  };
}

export default async function CategorySlugPage({
  params,
  searchParams,
}: Props) {
  const { slug } = params;
  const normalizedSlug = slug.replace(/-/g, " "); // replace all hyphens with spaces

  const page = parseInt(searchParams.page || "1", 10);
  const itemsPerPage = 24;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const { data, error, count } = await supabase
    .from("mockups")
    .select("id, categories, title, preview_url,slug, is_editable", {
      count: "exact",
    })
    .contains("categories", [normalizedSlug]) // use normalized slug here
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Supabase error:", error.message);
    return <p className="text-red-500">Failed to load category mockups.</p>;
  }

  const mockups =
    data?.map((item) => ({
      id: item.id,
      slug: item.slug,
      categories: item.categories,
      title: item.title,
      thumbnailUrl: item.preview_url ?? "/placeholder.jpg",
      isEditable: item.is_editable,
    })) ?? [];

  return (
    <>
      <Header />
      <section className="sticky top-20 z-30 bg-white">
        <Container>
          <div className="max-w-max mx-auto py-4">
            <CategoriesList currentCat={slug} />
          </div>
        </Container>
      </section>
      <main className="py-8">
        <Container>
          <GalleryGrid mockups={mockups} />
          <PaginationControls
            currentPage={page}
            totalItems={count ?? 0}
            itemsPerPage={itemsPerPage}
          />
        </Container>
      </main>
      <Footer />
    </>
  );
}
