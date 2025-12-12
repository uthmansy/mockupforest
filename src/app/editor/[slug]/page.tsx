// app/mockup/[slug]/page.tsx (or wherever this file is)
import MockupEditor from "@/components/MockupEditor";
import { supabase } from "@/lib/supabaseClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

// Update the Props interface — params is now a Promise
interface Props {
  params: Promise<{ slug: string }>;
}

async function fetchMockupBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from("mockups")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;
    return data;
  } catch (err) {
    console.error("Supabase fetch error:", err);
    return null;
  }
}

// generateMetadata must await params
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // ← Await here
  const mockup = await fetchMockupBySlug(slug);

  if (!mockup) {
    return { title: "Mockup Not Found" };
  }

  return {
    title: mockup.title,
    description: mockup.description?.slice(0, 160) ?? "",
  };
}

// Page component must be async and await params
export default async function MockupDetailPage({ params }: Props) {
  const { slug } = await params; // ← Await here
  const mockup = await fetchMockupBySlug(slug);

  if (!mockup) return notFound();

  return <MockupEditor mockupData={mockup} />;
}
