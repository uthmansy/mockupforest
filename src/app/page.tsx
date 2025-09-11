import Container from "@/components/Container";
import { Metadata } from "next";
import MockupGallery from "@/components/MockupGallery";
import CategoriesList from "@/components/CategoriesList";
import HeroSearch from "@/components/HeroSearch";

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
      <section className="mb-10">
        <HeroSearch />
      </section>
      <section className="mb-10">
        <Container>
          <div className="max-w-max mx-auto">
            <CategoriesList />
          </div>
        </Container>
      </section>
      <section className="mb-10">
        <Container>
          <MockupGallery searchParams={searchParams} />
        </Container>
      </section>
    </>
  );
}
