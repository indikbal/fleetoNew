"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { colors, fonts, styles } from "@/config/theme";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/profile";
  const { login, isLoggedIn } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) router.replace(redirectTo);
  }, [isLoggedIn, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await login(username, password);
      if (res.success) {
        router.push(redirectTo);
      } else {
        setError(res.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F7F7F7" }}>

      {/* ── Left: branding panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ backgroundColor: "#010101" }}
      >
        <Link href="/">
          <div className="relative w-20 h-20">
            <Image src="/images/logo.png" alt="Fleeto" fill className="object-contain" />
          </div>
        </Link>

        <div>
          <h1
            className="text-5xl xl:text-6xl leading-tight mb-6"
            style={{ ...styles.headingFont, color: "#fff" }}
          >
            Welcome to<br />
            <span style={{ color: colors.primary }}>FLEETO</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm" style={{ fontFamily: fonts.body }}>
            Log in to manage your profile, view orders, and continue your electric journey.
          </p>
        </div>

        <p className="text-gray-600 text-xs" style={{ fontFamily: fonts.body }}>
          © {new Date().getFullYear()} Fleetworth Automotives Pvt Ltd
        </p>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-6 sm:px-12 xl:px-20">

        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link href="/">
            <div className="relative w-16 h-16">
              <Image src="/images/logo.png" alt="Fleeto" fill className="object-contain" />
            </div>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          <h2
            className="text-3xl mb-2"
            style={{ ...styles.headingFont, color: "#010101" }}
          >
            Sign In
          </h2>
          <p className="text-gray-500 text-sm mb-8" style={{ fontFamily: fonts.body }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: colors.primary }} className="font-medium hover:underline">
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5 text-gray-700"
                style={{ fontFamily: fonts.body }}
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none transition-all"
                style={{ fontFamily: fonts.body }}
                onFocus={(e) => (e.currentTarget.style.borderColor = colors.primary)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                placeholder="Enter your username"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label
                  className="text-sm font-medium text-gray-700"
                  style={{ fontFamily: fonts.body }}
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm hover:underline"
                  style={{ color: colors.primary, fontFamily: fonts.body }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 bg-white text-sm outline-none transition-all"
                  style={{ fontFamily: fonts.body }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = colors.primary)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl" style={{ fontFamily: fonts.body }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-60"
              style={{
                backgroundColor: isSubmitting ? colors.primaryDark : colors.primary,
                fontFamily: fonts.body,
                ...styles.redButtonShadow,
              }}
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
              {!isSubmitting && <ArrowUpRight size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
