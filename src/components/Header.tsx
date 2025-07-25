"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Container from "./Container";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between px-4 py-8 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl text-gray-600 font-semibold tracking-tight"
            onClick={() => setMobileMenuOpen(false)}
          >
            Mockupforest
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-gray-700">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/mockups">Mockups</NavLink>
            <NavLink href="/categories">Categories</NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t animate-slide-down">
          <div className="p-4 space-y-3">
            <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink
              href="/mockups"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mockups
            </MobileNavLink>
            <MobileNavLink
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </MobileNavLink>
          </div>
        </div>
      )}
    </header>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link href={href} className="hover:text-blue-600 transition-colors">
      {children}
    </Link>
  );
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

function MobileNavLink({ href, children, onClick }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      className="block py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100 transition"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
