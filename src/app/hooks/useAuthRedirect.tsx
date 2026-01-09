"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthSession, signOut } from "@/helpers/functions";
import { User } from "@supabase/supabase-js";
import { useAuthStore } from "../stores/useAuthStore";

const PROTECTED_PATHS = ["/dashboard"];

const isProtectedRoute = (pathname: string) =>
  PROTECTED_PATHS.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signedOut, setSignedOut] = useState(false);

  const { setUser: setStoreUser } = useAuthStore();

  const onSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      setSignedOut(true);
    } finally {
      setSigningOut(false);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const session = await getAuthSession();
      setLoading(false);

      setUser(session?.user);
      setStoreUser(session?.user);

      if (!session?.user && isProtectedRoute(pathname)) {
        router.push("/login");
      }
    };

    getSession();
  }, [router, pathname, signedOut]);

  return { loading, user, signingOut, onSignOut };
}
