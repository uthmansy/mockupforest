"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Container from "./Container";
import Image from "next/image";
import SearchBox from "./SearchBox";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Mockups", href: "/mockups" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-milk border-b border-primary/30">
      <Container>
        <div className="flex items-center justify-between py-5">
          {/* Logo */}
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <Image
              src="/logo.png"
              alt="MockupForest logo"
              width={130}
              height={40}
              priority
            />
          </Link>

          {/* Desktop Nav & Search */}
          <div className="hidden lg:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group text-black hover:text-gray-900 transition-colors uppercase text-sm"
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-primary group-hover:w-full transition-all"></span>
                </Link>
              ))}
            </nav>
            <div className="relative">
              <SearchBox />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            onClick={() => setMenuOpen(true)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </Container>

      {/* Mobile Fullscreen Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 backdrop-blur-md z-50 flex flex-col animate-fade-in">
          <div className="flex items-center justify-between p-6">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <span className="text-2xl font-extrabold text-white">
                MockupForest
              </span>
            </Link>
            <button
              className="p-2 text-white hover:text-gray-200 transition"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          {/* Mobile Search */}
          <div className="px-6 mb-6 mx-auto">
            <SearchBox />
          </div>
          <nav className="flex flex-col items-center justify-center flex-1 space-y-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-semibold text-white hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
