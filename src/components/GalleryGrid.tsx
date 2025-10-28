// components/GalleryGrid.tsx
import Link from "next/link";
import { Mockup } from "./MockupGallery";
import Image from "next/image";
import { FiEdit2 } from "react-icons/fi";
import { BsFiletypePsd } from "react-icons/bs";

interface GalleryGridProps {
  mockups: Mockup[];
}

export default function GalleryGrid({ mockups }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {mockups.map((item, index) => (
        <div
          key={`${item.id}${index}`}
          className="group rounded-lg overflow-hidden bg-neutral-100 relative"
        >
          {/* Hover Overlay (Free + Edit) */}
          <div className="absolute top-0 left-0 right-0 p-5 z-10 flex space-x-2 justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-lime-300 rounded-lg px-3 h-12 flex items-center justify-center text-sm uppercase opacity-75 shadow-lg">
              free
            </span>
            <div className="flex space-x-2">
              {item.isEditable && (
                <Link
                  href={`/editor/${item.slug}`}
                  className="h-12 w-12 flex items-center justify-center bg-white rounded-lg shadow-lg text-primary hover:bg-lime-100 transition-colors"
                >
                  <FiEdit2 className="text-xl" />
                </Link>
              )}
              {item.downloadUrl && (
                <Link
                  href={`/mockups/${item.slug}`}
                  className="h-12 w-12 flex items-center justify-center bg-white rounded-lg shadow-lg text-primary hover:bg-lime-100 transition-colors"
                >
                  <BsFiletypePsd className="text-2xl" />
                </Link>
              )}
            </div>
          </div>

          {/* Image and Title */}
          <Link
            href={`${item.isEditable ? "/editor/" : "/mockups/"}${item.slug}`}
          >
            <div className="relative w-full aspect-[4/3.5] md:aspect-square rounded-lg overflow-hidden">
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 100vw"
                className="object-cover transition-transform duration-300 scale-110 group-hover:scale-125"
                quality={80}
                priority={false}
              />
            </div>
            <div className="px-3 py-5">
              <h3
                className="truncate text-sm text-black uppercase mb-0 font-medium"
                title={item.title}
              >
                {item.title?.split(" ").slice(0, 6).join(" ")}
                {item.title?.split(" ").length > 6 && " ..."}
              </h3>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
