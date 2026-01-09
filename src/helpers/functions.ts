import { supabase } from "@/lib/supabaseClient";
import { Mockup } from "@/types/db";
import { Session } from "@supabase/supabase-js";
import { useCallback } from "react";
import debounce from "lodash/debounce";

export const getAuthSession = async (): Promise<Session | null> => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Session error:", error);
      throw new Error(error.message);
    }
    return session;
  } catch (error: any) {
    console.error("Check login status error:", error);
    throw new Error(error.message);
  }
};

export const getMockups = async (
  page: number
): Promise<{ mockups: Mockup[]; count: number | null }> => {
  const safePage = Math.max(1, page);
  const itemsPerPage = 15;
  const from = (safePage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  // Fetch paginated mockups
  const { data, error, count } = await supabase
    .from("mockups")
    .select("*", {
      count: "exact",
    })
    .eq("is_editable", true)
    .order("rank_score", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching mockups:", error.message);
    throw new Error(error.message);
  }

  return { mockups: data, count };
};

export const updateCuratedScore = async (mockupId: string, value: number) => {
  const { error } = await supabase
    .from("mockups")
    .update({ curated_score: value })
    .eq("id", mockupId);

  if (error) {
    throw error;
  }
};

export const useDebouncedUpdate = () => {
  return useCallback(
    debounce(async (id: string, value: number) => {
      try {
        await updateCuratedScore(id, value);
      } catch (err) {
        console.error("Failed to update curated score:", err);
      }
    }, 300),
    []
  );
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
