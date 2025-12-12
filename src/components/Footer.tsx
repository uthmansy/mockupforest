// components/Footer.tsx
import Link from "next/link";
import Container from "./Container";
import Image from "next/image";
import { CiFacebook, CiInstagram, CiTwitter } from "react-icons/ci";

export default function Footer() {
  return (
    <footer className="site-footer bg-neutral-200">
      <Container>
        <div className="py-24 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Branding */}
          <div className="max-w-sm">
            <Image
              src="/logo.png"
              alt="MockupForest logo"
              width={120}
              height={40}
              priority
              className="mb-5"
            />
            <p className="">
              Your go-to source for high-quality mockups. Elevate your design
              projects with professional assets.
            </p>
            {/* Social & Newsletter */}
            {/* <div className="w-full max-w-md mx-auto">
              <form className="flex flex-row items-stretch">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1  px-4 border border-primary text-black/80 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent h-10"
                />
                <button
                  type="submit"
                  className="bg-primary uppercase  px-5 hover:bg-primary-dark transition h-10"
                >
                  Subscribe
                </button>
              </form>
            </div> */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Company Links */}
            <div>
              <h3 className="text-lg font-medium  uppercase mb-4">Company</h3>
              <ul className="space-y-2 text-black/80 ">
                <li>
                  <Link href="/about" className="hover:text-black transition">
                    About Us
                  </Link>
                </li>
                {/* <li>
                  <Link href="/blog" className="hover:text-black transition">
                    Blog
                  </Link>
                </li> */}

                <li>
                  <Link href="/contact" className="hover:text-black transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-medium uppercase  mb-4">Resources</h3>
              <ul className="space-y-2 text-black/80 ">
                <li>
                  <Link href="/privacy" className="hover:text-black transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-black transition">
                    Terms of Service
                  </Link>
                </li>
              </ul>
              <h3 className="text-lg font-medium uppercase  mb-4">
                Stay Connected
              </h3>
              <div className="flex space-x-2 mb-6 text-black/80 text-2xl">
                <Link
                  href="https://facebook.com/mockupforest"
                  aria-label="Facebook"
                  className="hover:text-black transition"
                >
                  <CiFacebook />
                </Link>
                <Link
                  href="https://instagram.com/mockupforest"
                  aria-label="Instagram"
                  className="hover:text-black transition"
                >
                  <CiInstagram />
                </Link>
                <Link
                  href="https://x.com/mockupforest"
                  aria-label="Instagram"
                  className="hover:text-black transition"
                >
                  <CiTwitter />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="border-t border-dashed border-primary mt-8 py-6 text-center text-black/80 text-xs">
        &copy; {new Date().getFullYear()} MockupForest. All rights reserved.
      </div>
    </footer>
  );
}
