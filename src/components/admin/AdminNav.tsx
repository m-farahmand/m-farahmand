"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/timeline", label: "Timeline" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/blog", label: "Blog" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-zinc-800 bg-zinc-900/50 p-4">
      <Link href="/admin" className="mb-8 block text-lg font-semibold text-white">
        Admin<span className="text-emerald-400">.</span>
      </Link>
      <nav className="space-y-1">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 border-t border-zinc-800 pt-4 space-y-2">
        <Link
          href="/"
          className="block px-3 py-2 text-sm text-zinc-500 hover:text-white"
        >
          &larr; Back to site
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
