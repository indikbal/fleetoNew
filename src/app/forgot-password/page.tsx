"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import { sendOtp, verifyOtp, resetPassword } from "@/lib/api";
import { colors, fonts, styles } from "@/config/theme";

type Step = "email" | "otp" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none transition-all";

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = colors.primary);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = "#E5E7EB");

  // ── Step 1: Send OTP ────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await sendOtp(email);
      if (res.success) {
        setStep("otp");
      } else {
        setError(res.message || "Could not send OTP. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 2: Verify OTP ──────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await verifyOtp(email, otp);
      if (res.success) {
        setStep("reset");
      } else {
        setError(res.message || "Invalid OTP. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 3: Reset Password ──────────────────────────────────────────────────
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await resetPassword(email, otp, newPassword);
      if (res.success) {
        setStep("done");
      } else {
        setError(res.message || "Could not reset password. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step indicator ──────────────────────────────────────────────────────────
  const steps = ["Email", "Verify OTP", "New Password"];
  const stepIndex = { email: 0, otp: 1, reset: 2, done: 3 }[step];

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
            Reset your<br />
            <span style={{ color: colors.primary }}>password</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm" style={{ fontFamily: fonts.body }}>
            Enter your email, verify with the OTP we send, then set a new password.
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

          {/* Step indicator */}
          {step !== "done" && (
            <div className="flex items-center gap-2 mb-8">
              {steps.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                      style={{
                        backgroundColor: i < stepIndex ? colors.primary : i === stepIndex ? colors.primary : "#E5E7EB",
                        color: i <= stepIndex ? "#fff" : "#9CA3AF",
                        fontFamily: fonts.body,
                      }}
                    >
                      {i < stepIndex ? "✓" : i + 1}
                    </div>
                    <span
                      className="text-xs font-medium hidden sm:block"
                      style={{
                        fontFamily: fonts.body,
                        color: i === stepIndex ? "#010101" : "#9CA3AF",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="h-px w-8 transition-colors"
                      style={{ backgroundColor: i < stepIndex ? colors.primary : "#E5E7EB" }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Step 1: Email ── */}
          {step === "email" && (
            <>
              <h2 className="text-3xl mb-2" style={{ ...styles.headingFont, color: "#010101" }}>
                Forgot Password
              </h2>
              <p className="text-gray-500 text-sm mb-8" style={{ fontFamily: fonts.body }}>
                Enter your registered email address and we&apos;ll send you an OTP.
              </p>
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700" style={{ fontFamily: fonts.body }} htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    style={{ fontFamily: fonts.body }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="your@email.com"
                  />
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl" style={{ fontFamily: fonts.body }}>{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white text-sm font-semibold rounded-full disabled:opacity-60"
                  style={{ backgroundColor: colors.primary, fontFamily: fonts.body, ...styles.redButtonShadow }}
                >
                  {isSubmitting ? "Sending OTP…" : "Send OTP"}
                  {!isSubmitting && <ArrowUpRight size={16} />}
                </button>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  style={{ fontFamily: fonts.body }}
                >
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </form>
            </>
          )}

          {/* ── Step 2: Verify OTP ── */}
          {step === "otp" && (
            <>
              <h2 className="text-3xl mb-2" style={{ ...styles.headingFont, color: "#010101" }}>
                Enter OTP
              </h2>
              <p className="text-gray-500 text-sm mb-8" style={{ fontFamily: fonts.body }}>
                We sent a 6-digit OTP to <span className="font-medium text-gray-700">{email}</span>
              </p>
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700" style={{ fontFamily: fonts.body }} htmlFor="otp">
                    OTP Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className={inputClass + " tracking-widest text-center text-lg"}
                    style={{ fontFamily: fonts.body }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="000000"
                  />
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl" style={{ fontFamily: fonts.body }}>{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting || otp.length < 6}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white text-sm font-semibold rounded-full disabled:opacity-60"
                  style={{ backgroundColor: colors.primary, fontFamily: fonts.body, ...styles.redButtonShadow }}
                >
                  {isSubmitting ? "Verifying…" : "Verify OTP"}
                  {!isSubmitting && <ArrowUpRight size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep("email"); setError(""); setOtp(""); }}
                  className="flex items-center justify-center gap-1.5 w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  style={{ fontFamily: fonts.body }}
                >
                  <ArrowLeft size={14} /> Change email
                </button>
              </form>
            </>
          )}

          {/* ── Step 3: New Password ── */}
          {step === "reset" && (
            <>
              <h2 className="text-3xl mb-2" style={{ ...styles.headingFont, color: "#010101" }}>
                New Password
              </h2>
              <p className="text-gray-500 text-sm mb-8" style={{ fontFamily: fonts.body }}>
                Choose a strong password for your account.
              </p>
              <form onSubmit={handleReset} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700" style={{ fontFamily: fonts.body }} htmlFor="new-password">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={inputClass + " pr-11"}
                      style={{ fontFamily: fonts.body }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder="Min. 8 characters"
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
                {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl" style={{ fontFamily: fonts.body }}>{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white text-sm font-semibold rounded-full disabled:opacity-60"
                  style={{ backgroundColor: colors.primary, fontFamily: fonts.body, ...styles.redButtonShadow }}
                >
                  {isSubmitting ? "Resetting…" : "Reset Password"}
                  {!isSubmitting && <ArrowUpRight size={16} />}
                </button>
              </form>
            </>
          )}

          {/* ── Done ── */}
          {step === "done" && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <CheckCircle size={64} style={{ color: colors.primary }} />
              </div>
              <h2 className="text-3xl mb-3" style={{ ...styles.headingFont, color: "#010101" }}>
                Password Reset!
              </h2>
              <p className="text-gray-500 text-sm mb-8" style={{ fontFamily: fonts.body }}>
                Your password has been updated successfully. You can now log in with your new password.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-white text-sm font-semibold rounded-full"
                style={{ backgroundColor: colors.primary, fontFamily: fonts.body, ...styles.redButtonShadow }}
              >
                Go to Login <ArrowUpRight size={16} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
