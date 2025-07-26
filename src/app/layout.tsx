import Header from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free PSD Mockups",
  description:
    "Download high-quality free PSD mockups for devices, branding, and more.",
  icons: {
    icon: "/favicon.ico", // primary favicon
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
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
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
