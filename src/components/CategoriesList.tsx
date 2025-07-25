// components/CategoriesList.tsx
"use client";
import Link from "next/link";
import { Smartphone, Package, Shirt, Edit3, Sun, Home } from "lucide-react";

// Simulated category data with Lucide icons
export interface Category {
  id: string;
  name: string;
  slug: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const categories: Category[] = [
  { id: "1", name: "Devices", slug: "devices", Icon: Smartphone },
  { id: "2", name: "Packaging", slug: "packaging", Icon: Package },
  { id: "3", name: "Apparel", slug: "apparel", Icon: Shirt },
  { id: "4", name: "Stationery", slug: "stationery", Icon: Edit3 },
  { id: "5", name: "Outdoor", slug: "outdoor", Icon: Sun },
  { id: "6", name: "Home Decor", slug: "home-decor", Icon: Home },
];

export default function CategoriesList() {
  return (
    <div className="overflow-x-auto py-8">
      <ul className="flex space-x-6 px-6">
        {categories.map(({ id, name, slug, Icon }) => (
          <li key={id} className="flex-shrink-0">
            <Link
              href={`/category/${slug}`}
              className="flex flex-col items-center text-center text-gray-700 hover:text-primary transition"
            >
              <div className="w-16 h-16 mb-2 p-3 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm font-medium">{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
