import "./globals.css";
import type { Metadata } from "next";
import { Inter, Inter_Tight, Cinzel, Poppins } from "next/font/google";
import Script from "next/script";
import { Providers } from "./providers";

const inter = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Free Studio Quality Mockups in the Browser",
  description:
    "Create high quality pro Mockups right in the browser in second - No photoshop required",
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
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${cinzel.variable}`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FV21ZFQTVF"
          strategy="afterInteractive"
        />
        <meta name="google-adsense-account" content="ca-pub-7110287889370422" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FV21ZFQTVF');
          `}
        </Script>
      </head>
      <body className="">
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
