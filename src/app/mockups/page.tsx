import CategoriesList from "@/components/CategoriesList";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
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
    <>
      <Header />
      <section className="bg-white py-5">
        <Container>
          <h1
            style={{ fontFamily: "poppins" }}
            className="text-5xl text-center uppercase mb-0 max-w-lg mx-auto leading-[1] font-light"
          >
            Best Online Mockup Generator
          </h1>
        </Container>
      </section>
      <section className="sticky top-20 z-30 bg-white">
        <Container>
          <div className="max-w-max mx-auto py-4">
            <CategoriesList />
          </div>
        </Container>
      </section>
      <section className="py-8">
        <Container>
          <MockupGallery searchParams={searchParams} />
        </Container>
      </section>
      <Footer />
    </>
  );
}
