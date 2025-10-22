"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { useAuthStore } from "../stores/useAuthStore";

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, loading, error, user, checkLoginStatus } = useAuthStore();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleSession = async () => {
      await checkLoginStatus();
      setSuccess(true);
    };
    handleSession();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    setFocus,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Validate on change for immediate feedback
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Focus on email input on mount
  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      setSuccess(true);
      reset(); // Clear form on success
    } catch (err) {
      // Error is handled by the store
      console.error("Login error:", err);
    }
  };

  // If user exists and success is true, show success message
  if (user && success) {
    return (
      <>
        <Header />
        <Container>
          <main className="max-w-md mx-auto py-16">
            <div className="bg-white rounded-2xl shadow-md p-8 border border-neutral-200 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Welcome back!
              </h2>
              <p className="text-green-600 font-medium mb-4">
                Successfully logged in as {user.email}
              </p>
              <p className="text-gray-600 text-sm">
                You can now access all your account features.
              </p>
            </div>
          </main>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <main className="max-w-md mx-auto py-16">
          <div className="bg-white rounded-2xl shadow-md p-8 border border-neutral-200">
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  autoComplete="email"
                  className={`w-full rounded-lg border bg-neutral-50 p-3 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email
                      ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500"
                      : "border-neutral-300"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  className={`w-full rounded-lg border bg-neutral-50 p-3 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password
                      ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500"
                      : "border-neutral-300"
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <p className="text-sm text-red-800 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || isSubmitting || !isValid || !isDirty}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading || isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Additional helpful links */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center space-y-3">
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium block"
                >
                  Forgot your password?
                </a>
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </main>
      </Container>
      <Footer />
    </>
  );
}
