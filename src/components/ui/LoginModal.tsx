"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { colors, fonts, styles } from "@/config/theme";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

export default function LoginModal({ onSuccess, onClose }: Props) {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await login(username, password);
      if (res.success) {
        onSuccess();
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
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      >
        {/* Modal panel */}
        <motion.div
          key="panel"
          className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{ background: "#fff" }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div
            className="px-6 pt-7 pb-5 flex items-center gap-3"
            style={{ borderBottom: "1px solid #F3F4F6" }}
          >
            <div className="relative w-9 h-9 flex-shrink-0">
              <Image src="/images/logo.png" alt="Fleeto" fill className="object-contain" />
            </div>
            <div>
              <h2
                className="text-lg leading-tight"
                style={{ ...styles.headingFont, color: "#010101" }}
              >
                Sign in to continue
              </h2>
              <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: fonts.body }}>
                Log in to place your order
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Username */}
            <div>
              <label
                className="block text-xs font-medium text-gray-600 mb-1.5"
                style={{ fontFamily: fonts.body }}
                htmlFor="modal-username"
              >
                Username
              </label>
              <input
                id="modal-username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none transition-all"
                style={{ fontFamily: fonts.body }}
                onFocus={(e) => (e.currentTarget.style.borderColor = colors.primary)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label
                  className="text-xs font-medium text-gray-600"
                  style={{ fontFamily: fonts.body }}
                  htmlFor="modal-password"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  onClick={onClose}
                  className="text-xs hover:underline"
                  style={{ color: colors.primary, fontFamily: fonts.body }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="modal-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 bg-white text-sm outline-none transition-all"
                  style={{ fontFamily: fonts.body }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = colors.primary)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p
                className="text-xs text-red-600 bg-red-50 px-4 py-2.5 rounded-xl"
                style={{ fontFamily: fonts.body }}
              >
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
              {!isSubmitting && <ArrowUpRight size={15} />}
            </button>

            {/* Footer links */}
            <p
              className="text-center text-xs text-gray-400 pb-1"
              style={{ fontFamily: fonts.body }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                onClick={onClose}
                className="font-semibold hover:underline"
                style={{ color: colors.primary }}
              >
                Create one
              </Link>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
