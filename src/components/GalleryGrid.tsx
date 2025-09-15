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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockups.map((item, index) => (
          <div key={`${item.id}${index}`}>
            <Link href={`/mockups/${item.slug}`}>
              <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-72 overflow-hidden">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 100vw"
                  className="object-cover overflow-hidden transition-all duration-300 hover:scale-110"
                  quality={80}
                  priority={false}
                />
              </div>
              <div className="py-3">
                <span className="uppercase text-xs font-medium text-neutral-400 mb-1 inline-block">
                  {item.categories?.join(", ")}
                </span>
                <h3
                  className="truncate text-lg font text-sage-dark mb-0"
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
