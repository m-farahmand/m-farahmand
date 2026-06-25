"use client";

import { routing, type Locale } from "@/i18n/routing";

type Props = {
  active: Locale;
  onChange: (locale: Locale) => void;
};

export function LocaleTabs({ active, onChange }: Props) {
  return (
    <div className="mb-4 flex gap-2 border-b border-zinc-800 pb-3">
      {routing.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => onChange(locale)}
          className={`rounded-lg px-3 py-1.5 text-sm transition ${
            active === locale
              ? "bg-emerald-500/20 text-emerald-400"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          {locale === "fa" ? "فارسی" : "English"}
        </button>
      ))}
    </div>
  );
}
