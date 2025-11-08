import Container from "@/components/Container";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabaseClient";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CiFileOn, CiImageOn, CiSquareCheck } from "react-icons/ci";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

async function fetchMockupBySlug(slug: string) {
  const { data, error } = await supabase
    .from("mockups")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

async function fetchRelatedMockups(categories: string[], currentSlug: string) {
  if (!categories?.length) return [];

  const firstCategory = categories?.[0]; // take first from current mockup

  const { data, error } = await supabase
    .from("mockups")
    .select("id, categories, title, preview_url, slug, categories, is_editable")
    .overlaps("categories", [firstCategory])
    .neq("slug", currentSlug)
    .order("categories", {
      ascending: true,
      foreignTable: undefined,
    })
    .limit(6);

  if (error) {
    console.error("Error fetching related mockups:", error.message);
    return [];
  }

  return data ?? [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const mockup = await fetchMockupBySlug(params.slug);
  if (!mockup) return { title: "Mockup Not Found" };

  return {
    title: mockup.title,
    description: mockup.description?.slice(0, 160) ?? "",
  };
}

export default async function MockupDetailPage({ params }: Props) {
  const mockup = await fetchMockupBySlug(params.slug);
  const relatedMockups = await fetchRelatedMockups(
    mockup.categories || [],
    mockup.slug
  );

  if (!mockup) return notFound();

  return (
    <>
      <Header />
      <main className="py-12 mb-12">
        <Container>
          <h1 className="text-2xl text-gray-900 mb-8">{mockup.title}</h1>

          <div className="flex flex-col md:flex-row md:space-x-12">
            {/* Left: Image and Description */}
            <div className="flex-1">
              <div className="relative w-full aspect-[5/4] mb-8">
                <Image
                  src={mockup.preview_url || "/placeholder.jpg"}
                  alt={mockup.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>

              <div className="prose prose-lg text-gray-700 single-body">
                <p className="text-gray-400">{mockup.description}</p>
                <div className="border-t border-neutral-300 mb-12"></div>
                {mockup.body && (
                  <div dangerouslySetInnerHTML={{ __html: mockup.body }} />
                )}
              </div>
            </div>

            {/* Right: Sidebar */}
            <aside className="mt-12 md:mt-0 md:w-80 flex-shrink-0">
              <div className="sticky top-40 space-y-6">
                {mockup.download_url && (
                  <a
                    href={mockup.download_url}
                    className="block w-full text-center bg-primary text-white px-6 py-3 uppercase text-sm font-normal hover:bg-primary-dark transition"
                  >
                    Download PSD
                  </a>
                )}

                {/* Categories */}
                {mockup.categories?.length > 0 && (
                  <div className="text-sm">
                    <span className="uppercase text-lg">Categories:&nbsp;</span>
                    <div>
                      {mockup.categories.map((cat: string) => (
                        <Link
                          key={cat}
                          href={`/category/${cat.toLowerCase()}`}
                          className="text-primary hover:underline mr-2"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {mockup.tags?.length > 0 && (
                  <div>
                    <h2 className="text-lg uppercase mb-2">Tags</h2>
                    <ul className="flex flex-wrap gap-2 px-0 list-none">
                      {mockup.tags.map((tag: string) => (
                        <li
                          key={tag}
                          className="bg-primary text-white px-3 py-1 text-sm"
                        >
                          #{tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metadata */}
                <div className="bg-gray-100 px-7 py-10 text-sm">
                  <ul className="text-gray-700 space-y-3 pl-0 mb-0">
                    <li className="flex space-x-3 items-center">
                      <CiSquareCheck />
                      <span className="text-gray-500">
                        {mockup.file_type || "PSD"}
                      </span>
                    </li>
                    <li className="flex space-x-3 items-center">
                      <CiSquareCheck />
                      <span className="text-gray-500">
                        {mockup.file_size || "N/A"}
                      </span>
                    </li>
                    <li className="flex space-x-3 items-center">
                      <CiSquareCheck />
                      <span className="text-gray-500">
                        {mockup.file_dimensions || "N/A"}
                      </span>
                    </li>
                    <li className="flex space-x-3 items-center">
                      <CiSquareCheck />
                      <span className="text-gray-500">
                        {mockup.dpi || "N/A"} DPI
                      </span>
                    </li>
                    <li className="flex space-x-3 items-center">
                      <CiSquareCheck />
                      <span className="text-gray-500 text-right">
                        {/* {mockup.license || "Free"} */}
                        Personal & Commercial
                      </span>
                    </li>
                    <li className="flex space-x-3 items-center">
                      <CiSquareCheck />
                      <span className="text-gray-500">
                        {mockup.author || "Anonymous"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
          {relatedMockups.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl text-gray-800 mb-6">Related Mockups</h2>
              <GalleryGrid
                mockups={relatedMockups.map((item) => ({
                  id: item.id,
                  slug: item.slug,
                  title: item.title,
                  categories: item.categories,
                  thumbnailUrl: item.preview_url ?? "/placeholder.jpg",
                  isEditable: item.is_editable,
                }))}
              />
            </section>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
