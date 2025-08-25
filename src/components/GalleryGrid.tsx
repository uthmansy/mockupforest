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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {mockups.map((item) => (
          <div key={item.id} className="">
            <Link href={`/mockups/${item.slug}`}>
              <div className="relative w-full h-64">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover  overflow-hidden"
                  quality={80}
                  priority={false}
                />
              </div>
              <div className="py-4">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {item.title}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
