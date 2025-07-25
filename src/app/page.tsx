import Container from "@/components/Container";
import { Metadata } from "next";
import { Search } from "lucide-react"; // optional icon
import MockupGallery from "@/components/MockupGallery";

export const metadata: Metadata = {
  title: "Free PSD Mockups",
  description:
    "Download high-quality free PSD mockups for devices, branding, and more.",
};

export default function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  return (
    <>
      <section className="py-28 text-center bg-secondary-bg">
        <Container>
          <h1 className="max-w-screen-md mx-auto text-2xl md:text-3xl lg:text-5xl font-bold mb-6">
            Explore our curated collection of high-quality PSD mockups.
          </h1>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="flex items-center rounded-2xl border border-gray-300 bg-white px-4 py-3 shadow-md focus-within:ring-2 focus-within:ring-primary">
              <Search className="text-gray-400 w-5 h-5 mr-3" />
              <input
                type="text"
                placeholder="Search mockups, e.g., iPhone, packaging, apparel..."
                className="w-full text-base focus:outline-none bg-transparent placeholder-gray-400"
              />
            </div>
          </div>
        </Container>
      </section>
      <section className="py-28">
        <Container>
          <MockupGallery searchParams={searchParams} />
        </Container>
      </section>
    </>
  );
}
