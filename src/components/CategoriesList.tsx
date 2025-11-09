// components/CategoriesList.tsx
"use client";
import Link from "next/link";
import { Smartphone, Package, Shirt, Edit3, Sun, Home } from "lucide-react";
import { ReactNode } from "react";
import { CiBoxes, CiFileOn, CiLaptop, CiShirt } from "react-icons/ci";

// Simulated category data with Lucide icons
export interface Category {
  id: string;
  name: string;
  slug: string;
  Icon: ReactNode;
}

const categories: Category[] = [
  { id: "1", name: "Devices", slug: "devices", Icon: <CiLaptop /> },
  { id: "2", name: "Packaging", slug: "packaging", Icon: <CiBoxes /> },
  // { id: "3", name: "Apparel", slug: "apparel", Icon: <CiShirt /> },
  { id: "4", name: "Stationery", slug: "stationery", Icon: <CiFileOn /> },
];

export default function CategoriesList() {
  return (
    <div className="overflow-x-auto">
      <ul className="flex space-x-6 px-6 list-none mb-0">
        {categories.map(({ id, name, slug, Icon }) => (
          <li key={id} className="flex-shrink-0">
            <Link
              href={`/category/${slug}`}
              className="flex flex-col items-center text-center text-black hover:text-primary transition"
            >
              <div className="w-16 h-16 mb-2 p-3 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
                {Icon}
              </div>
              <span className="text-sm uppercase">{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
