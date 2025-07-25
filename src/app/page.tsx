import Container from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PSD Mockups",
  description:
    "Download high-quality free PSD mockups for devices, branding, and more.",
};

export default function Home() {
  return (
    <section className="py-28 text-center bg-secondary-bg">
      <Container>
        <h1 className="max-w-screen-md mx-auto text-2xl md:text-3xl lg:text-5xl mb-4">
          Explore our curated collection of high-quality PSD mockups.
        </h1>
        {/* Maybe a featured grid here later */}
      </Container>
    </section>
  );
}
