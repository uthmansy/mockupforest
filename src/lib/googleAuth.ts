import { supabase } from "./supabaseClient";

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
  }
};

// <button onclick="signInWithGoogle()">Sign in with Google</button>;
// const {
//   data: { user },
// } = await supabase.auth.getUser();

// console.log(user);
