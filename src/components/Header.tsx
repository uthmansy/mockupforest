"use client";

import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { X } from "lucide-react";
import Container from "./Container";
import Image from "next/image";
import SearchBox from "./SearchBox";
import { VscChromeClose, VscMenu } from "react-icons/vsc";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Mockups", href: "/mockups" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

interface HeaderBarProps {
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  menuOpen: boolean;
}

const HeaderBar = ({ menuOpen, setMenuOpen }: HeaderBarProps) => {
  return (
    <Container>
      <div className="flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="MockupForest logo"
            width={130}
            height={40}
            priority
          />
        </Link>

        {/* Right side: Search and Hamburger */}
        <div className="flex items-center space-x-4">
          {/* Search Box - visible on both mobile and desktop */}
          <div className="flex-shrink-0 hidden md:block">
            <SearchBox />
          </div>

          {/* Hamburger Menu Button */}
          <button
            className="p-2 text-gray-700 hover:text-black transition cursor-pointer hover:bg-gray-100 rounded-xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <VscChromeClose className="h-9 w-9" />
            ) : (
              <VscMenu className="h-9 w-9" />
            )}
          </button>
        </div>
      </div>
    </Container>
  );
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white h-[5rem]">
      <HeaderBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {/* Dropdown Menu - Full Width for both mobile and desktop */}
      {menuOpen && (
        <div className="w-full bg-white shadow-lg fixed top-0 left-0 right-0">
          <HeaderBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          <Container>
            <nav className="py-7">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-4 px-4 text-black hover:bg-gray-100 transition-colors text-center rounded-xl font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
