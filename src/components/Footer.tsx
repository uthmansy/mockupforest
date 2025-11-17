// components/Footer.tsx
import Link from "next/link";
import Container from "./Container";
import Image from "next/image";
import { CiFacebook, CiInstagram, CiTwitter } from "react-icons/ci";

export default function Footer() {
  return (
    <footer className="site-footer bg-neutral-800 border-t border-gray-700 uppercase">
      <Container>
        <div className="py-24 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Branding */}
          <div className="max-w-sm">
            <Image
              src="/dark-logo.png"
              alt="MockupForest logo"
              width={120}
              height={40}
              priority
              className="mb-5"
            />
            <p className="text-white/50 text-sm">
              Your go-to source for high-quality mockups. Elevate your design
              projects with professional assets.
            </p>
            {/* Social & Newsletter */}
            {/* <div className="w-full max-w-md mx-auto">
              <form className="flex flex-row items-stretch">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 text-sm px-4 border border-primary text-white/50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent h-10"
                />
                <button
                  type="submit"
                  className="bg-primary text-white uppercase text-sm px-5 hover:bg-primary-dark transition h-10"
                >
                  Subscribe
                </button>
              </form>
            </div> */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Company Links */}
            <div>
              <h3 className=" uppercase text-sm text-white mb-4">Company</h3>
              <ul className="space-y-2 text-white/50 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition">
                    About Us
                  </Link>
                </li>
                {/* <li>
                  <Link href="/blog" className="hover:text-white transition">
                    Blog
                  </Link>
                </li> */}

                <li>
                  <Link href="/contact" className="hover:text-white transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="uppercase text-sm text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-white/50 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition">
                    Terms of Service
                  </Link>
                </li>
              </ul>
              <h3 className="uppercase text-sm text-white mb-4">
                Stay Connected
              </h3>
              <div className="flex space-x-2 mb-6 text-white/50 text-2xl">
                <Link
                  href="https://facebook.com/mockupforest"
                  aria-label="Facebook"
                  className="hover:text-white transition"
                >
                  <CiFacebook />
                </Link>
                <Link
                  href="https://instagram.com/mockupforest"
                  aria-label="Instagram"
                  className="hover:text-white transition"
                >
                  <CiInstagram />
                </Link>
                <Link
                  href="https://x.com/mockupforest"
                  aria-label="Instagram"
                  className="hover:text-white transition"
                >
                  <CiTwitter />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="border-t border-primary mt-8 py-6 text-center text-white/50 text-xs">
        &copy; {new Date().getFullYear()} MockupForest. All rights reserved.
      </div>
    </footer>
  );
}
