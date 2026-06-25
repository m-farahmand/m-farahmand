"use client";

import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function Footer() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-zinc-800/60 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Farahmand. {tc("allRightsReserved")}
        </p>
        <div className="flex gap-6 text-sm text-zinc-500">
          <Link href="/about" className="hover:text-emerald-400">
            {t("about")}
          </Link>
          <Link href="/products" className="hover:text-emerald-400">
            {t("products")}
          </Link>
          <Link href="/contact" className="hover:text-emerald-400">
            {t("contact")}
          </Link>
          <NextLink href="/admin" className="hover:text-emerald-400">
            {t("admin")}
          </NextLink>
        </div>
      </div>
    </footer>
  );
}
