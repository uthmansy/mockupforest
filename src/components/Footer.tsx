// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">MockupForest</h2>
          <p className="text-gray-300 text-sm">
            Your go-to source for high-quality PSD mockups. Elevate your design
            projects with professional assets.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-white transition">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
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
            <li>
              <Link href="/support" className="hover:text-white transition">
                Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Social & Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Stay Connected
          </h3>
          <div className="flex space-x-4 mb-6 text-gray-400">
            <Link
              href="https://twitter.com"
              aria-label="Twitter"
              className="hover:text-white transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557a9.993 9.993 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724..." />
              </svg>
            </Link>
            <Link
              href="https://facebook.com"
              aria-label="Facebook"
              className="hover:text-white transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
              >
                <path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.353C0 23.406.593 24 1.324 24h11.495v-9.294H9.691v-3.622h3.128V8.414c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.716-1.796 1.765v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.676V1.324C24 .593 23.406 0 22.676 0z" />
              </svg>
            </Link>
            <Link
              href="https://instagram.com"
              aria-label="Instagram"
              className="hover:text-white transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </Link>
          </div>
          <form className="flex flex-col sm:flex-row items-center">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500 mb-3 sm:mb-0 sm:mr-2"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} MockupForest. All rights reserved.
      </div>
    </footer>
  );
}
