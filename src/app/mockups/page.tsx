import CategoriesList from "@/components/CategoriesList";
import Container from "@/components/Container";
import MockupGallery from "@/components/MockupGallery";
import Link from "next/link";

type Mockup = {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string;
};

async function fetchMockups(): Promise<Mockup[]> {
  // Replace with Supabase fetch later
  return [
    {
      id: "1",
      title: "MacBook Pro Mockup",
      slug: "macbook-pro-mockup",
      thumbnail_url: "/macbook-thumbnail.jpg",
    },
    {
      id: "2",
      title: "iPhone X Mockup",
      slug: "iphone-x-mockup",
      thumbnail_url: "/iphone-thumbnail.jpg",
    },
    {
      id: "3",
      title: "Business Card Mockup",
      slug: "business-card-mockup",
      thumbnail_url: "/business-card-thumbnail.jpg",
    },
  ];
}

export default async function MockupsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  return (
    <div className="py-8">
      <section>
        <Container>
          <div className="max-w-max mx-auto">
            <CategoriesList />
          </div>
        </Container>
      </section>
      <section className="py-5">
        <Container>
          <h1 className="text-3xl font-medium mb-10 text-center">
            All Free PSD Mockups
          </h1>
          <MockupGallery searchParams={searchParams} />
        </Container>
      </section>
    </div>
  );
}
