"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, User, LogOut, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { colors, fonts, styles } from "@/config/theme";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import type { HeaderMenuItem } from "@/lib/api";

interface NavbarClientProps {
  links: HeaderMenuItem[];
  logoUrl: string;
  testRideUrl: string;
}

const isExternalUrl = (url: string) => /^https?:\/\//i.test(url);

export default function NavbarClient({ links, logoUrl, testRideUrl }: NavbarClientProps) {
  const testRideIsExternal = isExternalUrl(testRideUrl);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const { totalCount } = useCart();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/40 backdrop-blur-xs shadow-md" : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative w-18 h-18">
            <Image
              src={logoUrl}
              alt="Fleeto Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className="text-sm font-medium transition-colors relative"
                  style={{
                    color: active ? colors.primary : colors.black,
                    fontFamily: fonts.body,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = active ? colors.primary : colors.black)}
                >
                  {link.title}
                  {active && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoading && (
            isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: colors.black, fontFamily: fonts.body }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = colors.black)}
                >
                  <User size={16} />
                  {user?.display_name || user?.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                  style={{ color: colors.black, fontFamily: fonts.body }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = colors.black)}
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium transition-colors"
                style={{ color: colors.black, fontFamily: fonts.body }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.black)}
              >
                Login
              </Link>
            )
          )}
          {/* Cart icon */}
          <Link href="/cart" className="relative p-2 transition-opacity hover:opacity-70" aria-label="Cart">
            <ShoppingCart size={22} style={{ color: colors.black }} />
            {totalCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: colors.primary, fontSize: "10px", fontFamily: fonts.body, fontWeight: 700 }}
              >
                {totalCount > 9 ? "9+" : totalCount}
              </span>
            )}
          </Link>

          {testRideIsExternal ? (
            <a
              href={testRideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-full transition-colors btn-red-inner-shadow"
              style={{
                backgroundColor: colors.primary,
                fontFamily: fonts.body,
                ...styles.redButtonShadow,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              Book A Test Ride
              <ArrowUpRight size={16} />
            </a>
          ) : (
            <Link
              href={testRideUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-full transition-colors btn-red-inner-shadow"
              style={{
                backgroundColor: colors.primary,
                fontFamily: fonts.body,
                ...styles.redButtonShadow,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              Book A Test Ride
              <ArrowUpRight size={16} />
            </Link>
          )}
        </div>

        {/* Mobile: cart icon + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <Link href="/cart" className="relative p-2" aria-label="Cart">
            <ShoppingCart size={22} style={{ color: colors.black }} />
            {totalCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: colors.primary, fontSize: "10px", fontFamily: fonts.body, fontWeight: 700 }}
              >
                {totalCount > 9 ? "9+" : totalCount}
              </span>
            )}
          </Link>
          <button
            className="p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    className="block text-lg font-medium transition-colors"
                    style={{
                      color: active ? colors.primary : colors.black,
                      fontFamily: fonts.body,
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.title}
                  </Link>
                );
              })}

              {!isLoading && (
                isLoggedIn ? (
                  <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 text-base font-medium"
                      style={{ color: colors.black, fontFamily: fonts.body }}
                      onClick={() => setMobileOpen(false)}
                    >
                      <User size={16} />
                      {user?.display_name || user?.username}
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); handleLogout(); }}
                      className="flex items-center gap-2 text-base font-medium"
                      style={{ color: colors.black, fontFamily: fonts.body }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block text-lg font-medium border-t border-gray-100 pt-3"
                    style={{ color: colors.black, fontFamily: fonts.body }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                )
              )}

              {testRideIsExternal ? (
                <a
                  href={testRideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-full mt-4 w-full justify-center"
                  style={{
                    backgroundColor: colors.primary,
                    fontFamily: fonts.body,
                    ...styles.redButtonShadow,
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  Book A Test Ride
                  <ArrowUpRight size={16} />
                </a>
              ) : (
                <Link
                  href={testRideUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-full mt-4 w-full justify-center"
                  style={{
                    backgroundColor: colors.primary,
                    fontFamily: fonts.body,
                    ...styles.redButtonShadow,
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  Book A Test Ride
                  <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
