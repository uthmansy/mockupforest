import { NextResponse } from "next/server";
import { indexAlgoliaRecords } from "@/lib/algolia";

export async function GET() {
  try {
    await indexAlgoliaRecords();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  }
}
