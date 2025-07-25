import Link from "next/link";

type Mockup = {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string;
};

async function fetchMockups(): Promise<Mockup[]> {
  // Replace with Supabase fetch later
  return [
    {
      id: "1",
      title: "MacBook Pro Mockup",
      slug: "macbook-pro-mockup",
      thumbnail_url: "/macbook-thumbnail.jpg",
    },
    {
      id: "2",
      title: "iPhone X Mockup",
      slug: "iphone-x-mockup",
      thumbnail_url: "/iphone-thumbnail.jpg",
    },
    {
      id: "3",
      title: "Business Card Mockup",
      slug: "business-card-mockup",
      thumbnail_url: "/business-card-thumbnail.jpg",
    },
  ];
}

export default async function MockupsPage() {
  const mockups = await fetchMockups();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">All Free PSD Mockups</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockups.map((mockup) => (
          <Link href={`/mockups/${mockup.slug}`} key={mockup.id}>
            <img
              alt={mockup.title}
              src={mockup.thumbnail_url}
              className="h-48 w-full object-cover rounded-t"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
