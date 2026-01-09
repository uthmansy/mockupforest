import { supabase } from "./supabaseClient";

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

// <button onclick="signInWithGoogle()">Sign in with Google</button>;
// const {
//   data: { user },
// } = await supabase.auth.getUser();

// console.log(user);
