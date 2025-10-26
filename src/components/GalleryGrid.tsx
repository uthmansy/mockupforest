// components/GalleryGrid.tsx

import Link from "next/link";
import { Mockup } from "./MockupGallery";
import Image from "next/image";

interface GalleryGridProps {
  mockups: Mockup[];
}

export default function GalleryGrid({ mockups }: GalleryGridProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mockups.map((item, index) => (
          <div
            className="rounded-lg overflow-hidden bg-neutral-100"
            key={`${item.id}${index}`}
          >
            <Link
              href={`${item.isEditable ? "/editor/" : "/mockups/"}${item.slug}`}
            >
              <div className="relative w-full aspect-[4/3.5] md:aspect-square rounded-lg overflow-hidden">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 100vw"
                  className="object-cover transition-all duration-300 scale-110 hover:scale-125"
                  quality={80}
                  priority={false}
                />
              </div>
              <div className="px-3 py-5 ">
                {/* <span className="uppercase text-xs font-medium text-neutral-400 mb-1 inline-block">
                  {item.categories?.join(", ")}
                </span> */}
                <h3
                  className="truncate text-sm text-black uppercase mb-0 font-medium"
                  title={item.title} // full text for SEO + tooltip
                >
                  {item.title?.split(" ").slice(0, 6).join(" ")}
                  {item.title?.split(" ").length > 6 && " ..."}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
