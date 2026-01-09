"use client";

import { signInWithGoogle } from "@/lib/googleAuth";
import { Button } from "@heroui/react";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import Container from "@/components/Container";
// import { useAuthStore } from "../stores/useAuthStore";

// // Enhanced Zod validation schema
// const loginSchema = z.object({
//   email: z
//     .string()
//     .min(1, "Email is required")
//     .email("Please enter a valid email address")
//     .transform((email) => email.toLowerCase().trim()),
//   password: z
//     .string()
//     .min(1, "Password is required")
//     .min(6, "Password must be at least 6 characters"),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// export default function LoginPage() {
//   const router = useRouter();
//   const { login, loading, error, user, checkLoginStatus, clearError } =
//     useAuthStore();
//   const [isRedirecting, setIsRedirecting] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting, isValid, isDirty },
//     setFocus,
//     setError: setFormError,
//     watch,
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     mode: "onChange",
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   // Clear store errors when form changes
//   const emailValue = watch("email");
//   const passwordValue = watch("password");
//   useEffect(() => {
//     if (error && (emailValue || passwordValue)) {
//       clearError();
//     }
//   }, [emailValue, passwordValue, error, clearError]);

//   // Focus on email input on mount
//   useEffect(() => {
//     setFocus("email");
//   }, [setFocus]);

//   // Check if user is already logged in
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       const isAuthenticated = await checkLoginStatus();
//       if (isAuthenticated && user) {
//         setIsRedirecting(true);
//         // Small delay to show success state
//         setTimeout(() => {
//           router.push("/dashboard");
//         }, 500);
//       }
//     };

//     checkAuthStatus();
//   }, [checkLoginStatus, user, router]);

//   const onSubmit = async (data: LoginFormData) => {
//     try {
//       const success = await login(data.email, data.password);
//       if (success) {
//         setIsRedirecting(true);
//         // Redirect to dashboard after successful login
//         setTimeout(() => {
//           router.push("/dashboard");
//         }, 1000);
//       }
//     } catch (err: any) {
//       // Handle specific error cases
//       if (err.message?.includes("network")) {
//         setFormError("root", {
//           message: "Network error. Please check your connection.",
//         });
//       } else if (err.message?.includes("invalid credentials")) {
//         setFormError("root", {
//           message: "Invalid email or password. Please try again.",
//         });
//       }
//     }
//   };

//   // Show loading state during redirect
//   if (isRedirecting || (user && !error)) {
//     return (
//       <>
//         <Header />
//         <Container>
//           <main className="max-w-md mx-auto py-16">
//             <div className="bg-white rounded-2xl shadow-md p-8 border border-neutral-200 text-center">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg
//                   className="w-8 h-8 text-green-600 animate-pulse"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//               </div>
//               <h2 className="text-xl font-bold text-gray-900 mb-2">
//                 Login Successful!
//               </h2>
//               <p className="text-green-600 font-medium mb-4">
//                 Welcome back{user?.email ? `, ${user.email}` : ""}
//               </p>
//               <p className="text-gray-600 text-sm mb-4">
//                 Redirecting to your dashboard...
//               </p>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
//               </div>
//             </div>
//           </main>
//         </Container>
//         <Footer />
//       </>
//     );
//   }

//   // Show loading state during initial auth check
//   if (loading && !isSubmitting) {
//     return (
//       <>
//         <Header />
//         <Container>
//           <main className="max-w-md mx-auto py-16">
//             <div className="bg-white rounded-2xl shadow-md p-8 border border-neutral-200 text-center">
//               <div className="flex justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//               </div>
//               <p className="mt-4 text-gray-600">Checking authentication...</p>
//             </div>
//           </main>
//         </Container>
//         <Footer />
//       </>
//     );
//   }

//   const isSubmitDisabled = loading || isSubmitting || !isValid || !isDirty;

//   return (
//     <>
//       <Header />
//       <Container>
//         <main className="max-w-md mx-auto py-8 md:py-16">
//           <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-neutral-200">
//             {/* Header with better visual hierarchy */}
//             <div className="text-center mb-8">
//               <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
//                 <svg
//                   className="w-6 h-6 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                   />
//                 </svg>
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">
//                 Welcome back
//               </h1>
//               <p className="text-gray-600 text-sm">
//                 Sign in to your account to continue
//               </p>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//               {/* Email Field */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block mb-2 text-sm font-medium text-gray-700"
//                 >
//                   Email address
//                 </label>
//                 <input
//                   {...register("email")}
//                   type="email"
//                   id="email"
//                   autoComplete="email"
//                   className={`w-full rounded-lg border bg-white px-4 py-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.email
//                       ? "border-red-300 bg-red-50 focus:ring-red-500"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                   placeholder="Enter your email"
//                   disabled={loading}
//                 />
//                 {errors.email && (
//                   <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
//                     <svg
//                       className="w-4 h-4 flex-shrink-0"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               {/* Password Field */}
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <label
//                     htmlFor="password"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Password
//                   </label>
//                   <a
//                     href="/forgot-password"
//                     className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//                   >
//                     Forgot password?
//                   </a>
//                 </div>
//                 <input
//                   {...register("password")}
//                   type="password"
//                   id="password"
//                   autoComplete="current-password"
//                   className={`w-full rounded-lg border bg-white px-4 py-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.password
//                       ? "border-red-300 bg-red-50 focus:ring-red-500"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                   placeholder="Enter your password"
//                   disabled={loading}
//                 />
//                 {errors.password && (
//                   <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
//                     <svg
//                       className="w-4 h-4 flex-shrink-0"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {errors.password.message}
//                   </p>
//                 )}
//               </div>

//               {/* Error Message */}
//               {(error || errors.root) && (
//                 <div className="rounded-lg bg-red-50 p-4 border border-red-200">
//                   <p className="text-sm text-red-800 flex items-center gap-2">
//                     <svg
//                       className="w-4 h-4 flex-shrink-0"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {error || errors.root?.message}
//                   </p>
//                 </div>
//               )}

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isSubmitDisabled}
//                 className="w-full py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:shadow-none"
//               >
//                 {loading || isSubmitting ? (
//                   <>
//                     <svg
//                       className="animate-spin h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Signing in...
//                   </>
//                 ) : (
//                   "Sign in to your account"
//                 )}
//               </button>
//             </form>

//             {/* Sign up link */}
//             <div className="mt-6 pt-6 border-t border-gray-200 text-center">
//               <p className="text-sm text-gray-600">
//                 Don't have an account?{" "}
//                 <a
//                   href="/signup"
//                   className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
//                 >
//                   Sign up now
//                 </a>
//               </p>
//             </div>

//             {/* Demo credentials hint (optional) */}
//             <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
//               <p className="text-xs text-gray-600 text-center">
//                 <strong>Demo:</strong> Try with email: demo@example.com /
//                 password: demo123
//               </p>
//             </div>
//           </div>
//         </main>
//       </Container>
//       <Footer />
//     </>
//   );
// }

function LoginPage() {
  return (
    <div>
      <Button onPress={signInWithGoogle}>Sign in with Google</Button>
    </div>
  );
}

export default LoginPage;
