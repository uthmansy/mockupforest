// components/MockupGallery.tsx
import GalleryGrid from "./GalleryGrid";
import PaginationControls from "./PaginationControls";

export interface Mockup {
  id: string;
  title: string;
  thumbnailUrl: string;
}

interface Props {
  searchParams: { page?: string };
}

const TOTAL_MOCKUPS = 100;

const generateMockups = (): Mockup[] => {
  return Array.from({ length: TOTAL_MOCKUPS }, (_, i) => ({
    id: `${i + 1}`,
    title: `Mockup #${i + 1}`,
    thumbnailUrl: `https://plus.unsplash.com/premium_photo-1722945721378-1c565f10859d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
  }));
};

export default async function MockupGallery({ searchParams }: Props) {
  const page = parseInt(searchParams.page || "1", 10);
  const itemsPerPage = 24;

  const allMockups = generateMockups();

  const paginated = allMockups.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="space-y-10">
      <GalleryGrid mockups={paginated} />
      <PaginationControls
        currentPage={page}
        totalItems={TOTAL_MOCKUPS}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
