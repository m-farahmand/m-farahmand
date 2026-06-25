"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const pathname = usePathname();
  const locale = useLocale();
  const { itemCount } = useCart();
  const t = useTranslations("nav");

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/products", label: t("products") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ] as const;

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          Farahmand<span className="text-emerald-400">.</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-emerald-400"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher currentLocale={locale} />
          <Link
            href="/cart"
            className="relative rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-emerald-500/50 hover:text-white"
          >
            {t("cart")}
            {itemCount > 0 && (
              <span className="absolute -top-2 -end-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-zinc-950">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
