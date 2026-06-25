"use client";

import { NextIntlClientProvider } from "next-intl";
import faMessages from "../../../messages/fa.json";

export function AdminIntlProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="fa" messages={faMessages}>
      {children}
    </NextIntlClientProvider>
  );
}
