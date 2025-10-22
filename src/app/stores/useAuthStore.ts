"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: any | null) => void;
  checkLoginStatus: () => Promise<void>;
  getUserProfile: () => Promise<void>; // Function to get user profile
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      set({ error: error.message, loading: false });
      return;
    }
    set({ user: data.user, loading: false });
  },

  logout: async () => {
    set({ loading: true });
    await supabase.auth.signOut();
    set({ user: null, loading: false });
  },
  checkLoginStatus: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      set({ user: session.user });
      await get().getUserProfile(); // If user is logged in, fetch user profile
    } else {
      set({ user: null });
    }
    set({ loading: false });
  },
  getUserProfile: async () => {
    set({ loading: true }); // Set loading state to true before fetching profile
    const { data: userProfile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", get().user?.id)
      .single();

    if (error) throw error.message;

    set({ user: userProfile, loading: false }); // Update userProfile and loading state
  },
}));
