// components/GalleryGrid.tsx

import { Mockup } from "./MockupGallery";
import Image from "next/image";

interface GalleryGridProps {
  mockups: Mockup[];
}

export default function GalleryGrid({ mockups }: GalleryGridProps) {
  return (
    <>
      <h2 className="mb-9 text-3xl font-semibold text-center">All Mockups</h2>{" "}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockups.map((item) => (
          <div key={item.id} className="">
            <div className="relative w-full h-64">
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover  overflow-hidden rounded-md"
                quality={80}
                priority={false}
              />
            </div>
            <div className="py-4">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
