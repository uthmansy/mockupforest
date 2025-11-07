"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/useAuthStore";

export function useAuthRedirect() {
  const router = useRouter();
  const { loading, user, checkLoginStatus } = useAuthStore();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await checkLoginStatus();

      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login");
        router.push("/login");
      }

      setInitialCheckDone(true);
    };

    checkAuth();
  }, [checkLoginStatus, router]);

  // Return loading state that includes the initial check
  const isLoading = loading || !initialCheckDone;

  return {
    loading: isLoading,
    user,
  };
}
