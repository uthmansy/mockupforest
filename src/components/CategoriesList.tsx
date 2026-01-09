"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { CiBoxes, CiFileOn, CiLaptop } from "react-icons/ci";

export interface Category {
  id: string;
  name: string;
  slug: string;
  Icon: ReactNode;
}

const categories: Category[] = [
  { id: "all", name: "All Mockups", slug: "all", Icon: <CiLaptop /> },
  { id: "1", name: "Devices", slug: "devices", Icon: <CiLaptop /> },
  { id: "2", name: "Packaging", slug: "packaging", Icon: <CiBoxes /> },
  { id: "4", name: "Stationery", slug: "stationery", Icon: <CiFileOn /> },
  { id: "5", name: "Cosmetics", slug: "cosmetics", Icon: <CiLaptop /> },
  { id: "6", name: "Apparels", slug: "apparels", Icon: <CiBoxes /> },
  { id: "7", name: "Posters", slug: "posters", Icon: <CiFileOn /> },
];

interface Props {
  currentCat?: string;
}

export default function CategoriesList({ currentCat }: Props) {
  // Default active category
  const activeCategory = currentCat || "all";

  const baseClasses =
    "flex space-x-2 items-center text-center transition rounded-full py-2 px-3 md:py-3 md:px-4";
  const activeClasses = "bg-primary text-white font-medium";
  const inactiveClasses = "bg-neutral-200 text-black hover:text-primary";

  return (
    <div className="overflow-x-auto">
      <ul className="flex space-x-3 list-none mb-0 pl-0">
        {categories.map(({ id, name, slug, Icon }) => {
          const isActive = activeCategory === slug;

          // Special case: ALL → /mockups
          if (slug === "all") {
            return (
              <li key={id} className="flex-shrink-0">
                <Link
                  href="/mockups"
                  className={`${baseClasses} ${
                    isActive ? activeClasses : inactiveClasses
                  }`}
                >
                  <span className="text-sm">{name}</span>
                </Link>
              </li>
            );
          }

          // Regular categories → /category/slug
          return (
            <li key={id} className="flex-shrink-0">
              <Link
                href={`/category/${slug}`}
                className={`${baseClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`}
              >
                <span className="text-xl">{Icon}</span>
                <span className="text-sm">{name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
