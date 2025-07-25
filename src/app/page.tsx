import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PSD Mockups",
  description:
    "Download high-quality free PSD mockups for devices, branding, and more.",
};

export default function Home() {
  return (
    <section className="px-6 py-20 text-center">
      <h1 className="text-gray-600 text-5xl mb-4">
        Explore our curated collection of high-quality PSD mockups.
      </h1>
      {/* Maybe a featured grid here later */}
    </section>
  );
}
