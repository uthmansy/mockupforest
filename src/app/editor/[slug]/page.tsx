import MockupEditor from "@/components/MockupEditor";
import { supabase } from "@/lib/supabaseClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

async function fetchMockupBySlug(slug: string) {
  const { data, error } = await supabase
    .from("mockups")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const mockup = await fetchMockupBySlug(params.slug);
  if (!mockup) return { title: "Mockup Not Found" };

  return {
    title: mockup.title,
    description: mockup.description?.slice(0, 160) ?? "",
  };
}

export default async function MockupDetailPage({ params }: Props) {
  const mockup = await fetchMockupBySlug(params.slug);

  if (!mockup) return notFound();

  return (
    <>
      <MockupEditor mockupData={mockup} />
    </>
  );
}
