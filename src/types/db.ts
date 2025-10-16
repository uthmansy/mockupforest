import { Database } from "./supabase";

export type Mockup = Database["public"]["Tables"]["mockups"]["Row"];
