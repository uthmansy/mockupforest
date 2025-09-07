import Container from "@/components/Container";
import { supabase } from "@/lib/supabaseClient";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  if (!mockup) return notFound();

  return (
    <main className="py-12 mb-12">
      <Container>
        <h1 className="text-2xl font-medium text-gray-900 mb-8">
          {mockup.title}
        </h1>

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
              />
            </div>

            <div className="prose prose-lg text-gray-700 single-body">
              <p className="text-gray-400">{mockup.description}</p>
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
                  className="block w-full text-center bg-primary text-white px-6 py-3 font-medium hover:bg-primary-dark transition"
                >
                  Download PSD
                </a>
              )}

              {/* Categories */}
              {mockup.categories?.length > 0 && (
                <div className="text-sm">
                  <span className="font-semibold text-gray-700">
                    Categories:&nbsp;
                  </span>
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
              )}

              {/* Tags */}
              {mockup.tags?.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Tags
                  </h2>
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
              <div className="bg-gray-100 p-6">
                <ul className="text-gray-700 space-y-3">
                  <li className="flex justify-between">
                    <span className="font-bold">File Types:</span>
                    <span className="text-gray-500">
                      {mockup.file_type || "PSD"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-bold">File Size:</span>
                    <span className="text-gray-500">
                      {mockup.file_size || "N/A"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-bold">Dimensions:</span>
                    <span className="text-gray-500">
                      {mockup.file_dimensions || "N/A"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-bold">DPI:</span>
                    <span className="text-gray-500">{mockup.dpi || "N/A"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-bold">License:</span>
                    <span className="text-gray-500">
                      {mockup.license || "Free"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-bold">Author:</span>
                    <span className="text-gray-500">
                      {mockup.author || "Anonymous"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}
