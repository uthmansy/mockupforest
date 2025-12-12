import Container from "@/components/Container";
import { Metadata } from "next";
import MockupGallery from "@/components/MockupGallery";
import CategoriesList from "@/components/CategoriesList";
import HeroSearch from "@/components/HeroSearch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedMockups from "@/components/FeaturedMockups";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import Link from "next/link";
import RecentAdditions from "@/components/RecentAdditions";

export const metadata: Metadata = {
  title: "Free Studio Quality Mockups in the Browser",
  description:
    "Create high quality pro Mockups right in the browser in second - No photoshop required.",
};

export default function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  return (
    <>
      <Header />
      <section className="my-8">
        <HeroSearch />
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
