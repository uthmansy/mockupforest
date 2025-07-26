import Container from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me – MockupForest",
  description:
    "I’m a solo designer behind MockupForest, crafting premium PSD mockups to help you elevate your projects.",
};

export default function AboutPage() {
  return (
    <>
      <Container>
        <main className="max-w-3xl mx-auto py-16 prose prose-neutral">
          <h1>About Me</h1>
          <p>
            Hi, I’m Shuaibu, the founder and sole creator of MockupForest. With
            over 10 years of experience in graphic design and digital art, I set
            out to build a library of premium PSD mockups that save time and
            inspire creativity.
          </p>
          <h2>My Mission</h2>
          <p>
            To empower designers and marketers with easy-to-use, high-quality
            mockups that streamline workflows and bring concepts to life.
          </p>
          <h2>Why MockupForest?</h2>
          <p>
            Every mockup is hand-crafted, tested, and refined to ensure
            pixel-perfect presentation and seamless customization. I personally
            curate each asset so you can focus on what matters—your creativity.
          </p>
          <h2>Get in Touch</h2>
          <p>
            Have questions or suggestions? Feel free to{" "}
            <a href="/contact">reach out</a>. I’d love to hear how I can help
            elevate your next project.
          </p>
        </main>
      </Container>
    </>
  );
}
