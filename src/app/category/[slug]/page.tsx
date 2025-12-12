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
  params: Promise<{ slug: string }>; // Now a Promise
  searchParams: Promise<{ page?: string }>; // Now a Promise
}

export const revalidate = 60; // ISR: revalidates every 60s

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // Await here
  return {
    title: `Category: ${slug.replace("-", " ")}`,
    description: `Browse ${slug.replace("-", " ")} mockups`,
  };
}

export default async function CategorySlugPage(props: Props) {
  const { params: paramsPromise, searchParams: searchParamsPromise } = props;
  const { slug } = await paramsPromise; // Await params
  const searchParams = await searchParamsPromise; // Await searchParams
  const normalizedSlug = slug.replace(/-/g, " "); // Now safe

  const page = parseInt(searchParams.page || "1", 10);
  const itemsPerPage = 24;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const { data, error, count } = await supabase
    .from("mockups")
    .select("id, categories, title, preview_url,slug, is_editable", {
      count: "exact",
    })
    .contains("categories", [normalizedSlug]) // Now matches data
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
