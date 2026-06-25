import type { Locale } from "@/i18n/routing";

const localeMap: Record<Locale, string> = {
  fa: "fa-IR",
  en: "en-US",
};

export function formatPrice(price: number, locale: Locale = "fa"): string {
  return new Intl.NumberFormat(localeMap[locale], {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDate(date: string | Date, locale: Locale = "fa"): string {
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function parseTags(tags: string): string[] {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

export function parseFeatures(features: string): string[] {
  if (!features) return [];
  return features.split("\n").map((f) => f.trim()).filter(Boolean);
}

export function productTypeLabel(
  type: string,
  labels?: Record<string, string>
): string {
  const defaults: Record<string, string> = {
    software: "Software",
    app: "App",
    device: "Device",
  };
  const map = labels ?? defaults;
  return map[type] || type;
}

export function orderStatusLabel(
  status: string,
  labels?: Record<string, string>
): string {
  const defaults: Record<string, string> = {
    pending: "Pending",
    paid: "Paid",
    delivered: "Delivered",
  };
  const map = labels ?? defaults;
  return map[status] || status;
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "fa" ? "rtl" : "ltr";
}
