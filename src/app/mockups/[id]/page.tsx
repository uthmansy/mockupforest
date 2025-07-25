// File: src/app/mockups/[id]/page.tsx
import Container from "@/components/Container";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: { id: string };
}

// Simulate fetching a single mockup by ID
const fetchMockupById = (id: string) => ({
  id,
  title: `Mockup #${id}`,
  description: `This is a detailed description for mockup #${id}. Use this section to describe the device, perspective, and any special features. You can also add usage tips or showcase context here.`,
  imageUrl: `https://plus.unsplash.com/premium_photo-1722945721378-1c565f10859d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
  tags: ["device", "creative", "ui", "photorealistic"],
  category: { name: "Devices", slug: "devices" },
  downloadUrl: `https://example.com/download/mockup-${id}.zip`,
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const mockup = fetchMockupById(params.id);
  return {
    title: mockup.title,
    description: mockup.description.slice(0, 160),
  };
}

export default function MockupDetailPage({ params }: Props) {
  const { id } = params;
  const mockup = fetchMockupById(id);

  return (
    <main className="py-12 mb-12">
      <Container>
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {mockup.title}
        </h1>

        <div className="flex flex-col md:flex-row md:space-x-12">
          {/* Left: Image + Description */}
          <div className="flex-1">
            <div className="relative w-full h-[450px] mb-8 rounded-2xl overflow-hidden">
              <Image
                src={mockup.imageUrl}
                alt={mockup.title}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                priority
              />
            </div>

            <div className="prose prose-lg text-gray-700">
              <p>{mockup.description}</p>
            </div>
          </div>

          {/* Right: Sticky Sidebar */}
          <aside className="mt-12 md:mt-0 md:w-80 flex-shrink-0">
            <div className="sticky top-40 space-y-6">
              {/* Download Button */}
              <a
                href={mockup.downloadUrl}
                className="block w-full text-center bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition"
              >
                Download PSD
              </a>

              {/* Category Link */}
              <div className="text-sm">
                <span className="font-semibold text-gray-700">
                  Category:&nbsp;
                </span>
                <Link
                  href={`/category/${mockup.category.slug}`}
                  className="text-primary hover:underline"
                >
                  {mockup.category.name}
                </Link>
              </div>

              {/* Tags */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Tags
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {mockup.tags.map((tag) => (
                    <li
                      key={tag}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Metadata Info */}
              <div className="bg-gray-100 p-6 rounded-lg">
                <ul className="text-gray-700 space-y-3">
                  <li className="flex justify-between">
                    <span className="font-bold">Applications:</span>
                    <span className="text-gray-500">Photoshop</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-bold">File Types:</span>
                    <span className="text-gray-500">PSD</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-bold">File Size:</span>
                    <span className="text-gray-500">45 MB</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-bold">Dimension:</span>
                    <span className="text-gray-500">300 DPI</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-bold">License:</span>
                    <span className="text-gray-500">Free For Use</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-bold">Author:</span>
                    <span className="text-gray-500">Mockupful.com</span>
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
