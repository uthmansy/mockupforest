import Header from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Container from "@/components/Container";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free PSD Mockups",
  description:
    "Download high-quality free PSD mockups for devices, branding, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header /> {/* <- add here */}
        <main>
          <Container>{children}</Container>
        </main>
      </body>
    </html>
  );
}
