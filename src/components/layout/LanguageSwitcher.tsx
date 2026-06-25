"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

type Props = {
  currentLocale: string;
};

export function LanguageSwitcher({ currentLocale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="flex rounded-lg border border-zinc-700 text-xs">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={`px-2.5 py-1.5 transition ${
            currentLocale === loc
              ? "bg-emerald-500/20 text-emerald-400"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {loc === "fa" ? "فا" : "EN"}
        </button>
      ))}
    </div>
  );
}
