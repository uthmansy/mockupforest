// src/app/mockups/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Mockup = {
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  psd_url: string;
};

// Simulate database fetch by slug
async function getMockupBySlug(slug: string): Promise<Mockup | null> {
  const mockups: Mockup[] = [
    {
      slug: "macbook-pro-mockup",
      title: "MacBook Pro Mockup",
      description: "A high-resolution MacBook Pro PSD mockup.",
      thumbnail_url: "/macbook-thumbnail.jpg",
      psd_url: "/macbook-mockup.psd",
    },
    {
      slug: "iphone-mockup",
      title: "iPhone Mockup",
      description: "An elegant iPhone mockup design.",
      thumbnail_url: "/iphone-thumbnail.jpg",
      psd_url: "/iphone-mockup.psd",
    },
  ];

  return mockups.find((m) => m.slug === slug) || null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const mockup = await getMockupBySlug(params.slug);

  if (!mockup) {
    return {
      title: "Mockup Not Found",
    };
  }

  return {
    title: `${mockup.title} - Free PSD Mockup`,
    description: mockup.description,
  };
}

export default async function MockupPage({
  params,
}: {
  params: { slug: string };
}) {
  const mockup = await getMockupBySlug(params.slug);

  //   if (!mockup) return notFound();

  return (
    <a className="bg-blue-600 text-white px-4 py-2 rounded" download>
      Download PSD
    </a>
  );
  //   return (
  //     <div className="max-w-4xl mx-auto p-6">
  //       <p className="text-gray-700 mb-4">{mockup.description}</p>
  //       <a
  //         href={mockup.psd_url}
  //         className="bg-blue-600 text-white px-4 py-2 rounded"
  //         download
  //       >
  //         Download PSD
  //       </a>
  //     </div>
  //   );
}
