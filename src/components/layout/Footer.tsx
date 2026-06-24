"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-zinc-800/60 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Farahmand. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-zinc-500">
          <Link href="/about" className="hover:text-emerald-400">
            About
          </Link>
          <Link href="/products" className="hover:text-emerald-400">
            Products
          </Link>
          <Link href="/contact" className="hover:text-emerald-400">
            Contact
          </Link>
          <Link href="/admin" className="hover:text-emerald-400">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
