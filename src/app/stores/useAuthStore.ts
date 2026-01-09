"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

// interface User {
//   id: string;
//   email?: string;
//   // Add other user properties you expect
// }

interface AuthState {
  user: User | undefined;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | undefined) => void;
  checkLoginStatus: () => Promise<boolean>;
  getUserProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: undefined,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),

  clearError: () => set({ error: null }),

  login: async (email: string, password: string): Promise<boolean> => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        set({ error: error.message, loading: false });
        return false;
      }

      if (data.user) {
        set({ user: data.user, loading: false });
        // Fetch user profile after successful login
        await get().getUserProfile();
        return true;
      }

      set({ error: "Login failed: No user data returned", loading: false });
      return false;
    } catch (error: any) {
      set({
        error: error.message || "An unexpected error occurred during login",
        loading: false,
      });
      return false;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await supabase.auth.signOut();
      set({ user: undefined, loading: false, error: null });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  checkLoginStatus: async (): Promise<boolean> => {
    set({ loading: true });

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error);
        set({ user: undefined, loading: false });
        return false;
      }

      if (session?.user) {
        set({ user: session.user });
        // Fetch user profile if user exists
        await get().getUserProfile();
        set({ loading: false });
        return true;
      }

      set({ user: undefined, loading: false });
      return false;
    } catch (error: any) {
      console.error("Check login status error:", error);
      set({ user: undefined, loading: false, error: error.message });
      return false;
    }
  },

  getUserProfile: async () => {
    const currentUser = get().user;
    if (!currentUser?.id) {
      console.warn("No user ID available for profile fetch");
      return;
    }

    set({ loading: true });

    try {
      const { data: userProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (error) {
        // Don't throw, just log - profile might not exist yet
        console.warn("Profile fetch error:", error);
        set({ loading: false });
        return;
      }

      // Merge profile data with existing user data
      set({
        user: { ...currentUser, ...userProfile },
        loading: false,
      });
    } catch (error: any) {
      console.error("Unexpected error in getUserProfile:", error);
      set({ loading: false });
    }
  },
}));
