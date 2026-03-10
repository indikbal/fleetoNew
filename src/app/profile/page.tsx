"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, User, ShoppingBag, LogOut, Pencil, X, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchMyProfile, updateProfile, type UserProfile } from "@/lib/api";
import { colors, fonts, styles } from "@/config/theme";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, logout } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Editable fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace("/login");
  }, [isLoading, isLoggedIn, router]);

  // Fetch profile
  useEffect(() => {
    if (!user) return;
    fetchMyProfile(user.user_id)
      .then((p) => {
        setProfile(p);
        setFirstName(p.first_name);
        setLastName(p.last_name);
        setEmail(p.email);
      })
      .catch(() => {/* profile still loads from auth user fallback */})
      .finally(() => setIsFetching(false));
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaveMsg(null);
    setIsSaving(true);
    try {
      const res = await updateProfile(user.user_id, firstName, lastName, email);
      if (res.success) {
        setProfile((prev) => prev ? { ...prev, first_name: firstName, last_name: lastName, email } : prev);
        setSaveMsg({ ok: true, text: "Profile updated successfully." });
        setIsEditing(false);
      } else {
        setSaveMsg({ ok: false, text: res.message || "Update failed." });
      }
    } catch {
      setSaveMsg({ ok: false, text: "Something went wrong." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border bg-white text-sm outline-none transition-all";

  if (isLoading || (!isLoggedIn && !isFetching)) return null;

  const displayName = profile?.display_name || user?.display_name || user?.username || "";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      <main className="min-h-screen pt-24 pb-16 px-4" style={{ backgroundColor: "#F7F7F7" }}>
        <div className="max-w-4xl mx-auto">

          {/* ── Header card ── */}
          <div
            className="rounded-2xl p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            style={{ backgroundColor: "#010101" }}
          >
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
              style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
            >
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl text-white mb-1" style={styles.headingFont}>
                {displayName}
              </h1>
              <p className="text-gray-400 text-sm truncate" style={{ fontFamily: fonts.body }}>
                {profile?.email || user?.email || ""}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white border border-white/20 hover:border-white/50 transition-colors flex-shrink-0"
              style={{ fontFamily: fonts.body }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>

          {/* ── Quick links ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Link
              href="/orders"
              className="flex items-center gap-4 p-5 rounded-2xl bg-white hover:shadow-md transition-shadow"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <ShoppingBag size={18} style={{ color: colors.primary }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: fonts.body }}>My Orders</p>
                <p className="text-xs text-gray-500" style={{ fontFamily: fonts.body }}>View your order history</p>
              </div>
              <ArrowUpRight size={16} className="ml-auto text-gray-400" />
            </Link>

            <Link
              href="/cart"
              className="flex items-center gap-4 p-5 rounded-2xl bg-white hover:shadow-md transition-shadow"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <User size={18} style={{ color: colors.primary }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: fonts.body }}>My Cart</p>
                <p className="text-xs text-gray-500" style={{ fontFamily: fonts.body }}>View your saved cart</p>
              </div>
              <ArrowUpRight size={16} className="ml-auto text-gray-400" />
            </Link>
          </div>

          {/* ── Profile details card ── */}
          <div className="bg-white rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: fonts.body }}>
                Profile Details
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => { setIsEditing(true); setSaveMsg(null); }}
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full border transition-colors"
                  style={{ color: colors.primary, borderColor: colors.primary, fontFamily: fonts.body }}
                >
                  <Pencil size={13} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFirstName(profile?.first_name ?? "");
                      setLastName(profile?.last_name ?? "");
                      setEmail(profile?.email ?? "");
                      setSaveMsg(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors"
                    style={{ fontFamily: fonts.body }}
                  >
                    <X size={13} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full text-white disabled:opacity-60 transition-colors"
                    style={{ backgroundColor: colors.primary, fontFamily: fonts.body }}
                  >
                    <Check size={13} /> {isSaving ? "Saving…" : "Save"}
                  </button>
                </div>
              )}
            </div>

            {isFetching ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* First Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide" style={{ fontFamily: fonts.body }}>
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputClass}
                      style={{ fontFamily: fonts.body, borderColor: "#E5E7EB" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = colors.primary)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                    />
                  ) : (
                    <p className="text-sm text-gray-900 px-4 py-3 rounded-xl bg-gray-50" style={{ fontFamily: fonts.body }}>
                      {profile?.first_name || "—"}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide" style={{ fontFamily: fonts.body }}>
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputClass}
                      style={{ fontFamily: fonts.body, borderColor: "#E5E7EB" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = colors.primary)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                    />
                  ) : (
                    <p className="text-sm text-gray-900 px-4 py-3 rounded-xl bg-gray-50" style={{ fontFamily: fonts.body }}>
                      {profile?.last_name || "—"}
                    </p>
                  )}
                </div>

                {/* Username (read-only) */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide" style={{ fontFamily: fonts.body }}>
                    Username
                  </label>
                  <p className="text-sm text-gray-900 px-4 py-3 rounded-xl bg-gray-50" style={{ fontFamily: fonts.body }}>
                    {profile?.username || user?.username || "—"}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide" style={{ fontFamily: fonts.body }}>
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      style={{ fontFamily: fonts.body, borderColor: "#E5E7EB" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = colors.primary)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                    />
                  ) : (
                    <p className="text-sm text-gray-900 px-4 py-3 rounded-xl bg-gray-50 truncate" style={{ fontFamily: fonts.body }}>
                      {profile?.email || user?.email || "—"}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Save message */}
            {saveMsg && (
              <p
                className="mt-4 text-sm px-4 py-3 rounded-xl"
                style={{
                  fontFamily: fonts.body,
                  color: saveMsg.ok ? "#15803D" : "#DC2626",
                  backgroundColor: saveMsg.ok ? "#F0FDF4" : "#FEF2F2",
                }}
              >
                {saveMsg.text}
              </p>
            )}
          </div>

        </div>
      </main>
    </>
  );
}
