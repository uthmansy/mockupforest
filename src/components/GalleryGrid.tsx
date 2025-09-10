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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {mockups.map((item, index) => (
          <div key={`${item.id}${index}`} className="">
            <Link href={`/mockups/${item.slug}`}>
              <div className="relative w-full aspect-square md:aspect-auto md:h-72">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 100vw"
                  className="object-cover overflow-hidden"
                  quality={80}
                  priority={false}
                />
              </div>
              <div className="">
                <h3 className="sr-only">{item.title}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
