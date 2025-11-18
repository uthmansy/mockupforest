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
      <section className="mb-5">
        <HeroSearch />
      </section>
      <section className="mb-5">
        <Container>
          <div className="max-w-max mx-auto">
            <CategoriesList />
          </div>
        </Container>
      </section>
      <section className="mb-10">
        <Container>
          <section className="mb-20">
            <Divider className="my-4" />
            <div className="flex items-center justify-between">
              <h2 className="uppercase">Featured Mockups</h2>
              <Link href={"/mockups"}>
                <Button color="primary" className="rounded-full">
                  View All
                </Button>
              </Link>
            </div>
            <FeaturedMockups />
          </section>
          <section className="mb-20">
            <Divider className="my-4" />
            <h2 className="uppercase">Recent Additions</h2>
            <RecentAdditions />
            <div className="py-10">
              <Link href={"/mockups"}>
                <Button
                  color="primary"
                  className="w-full rounded-full h-16 uppercase"
                >
                  View All
                </Button>
              </Link>
            </div>
          </section>
        </Container>
      </section>
      <Footer />
    </>
  );
}
