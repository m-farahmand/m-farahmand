"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const t = useTranslations("contact");
  const tc = useTranslations("common");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-4 text-4xl font-bold text-white">{t("title")}</h1>
      <p className="mb-12 text-lg text-zinc-400">{t("subtitle")}</p>

      {submitted ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
          <p className="text-emerald-400">{t("successMessage")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm text-zinc-400">{tc("name")}</label>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-400">{tc("email")}</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-400">{tc("message")}</label>
            <textarea
              name="message"
              required
              rows={5}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-8 py-3 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
          >
            {t("sendMessage")}
          </button>
        </form>
      )}

      <div className="mt-16 border-t border-zinc-800 pt-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          {t("connect")}
        </h2>
        <div className="flex gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-emerald-400"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-emerald-400"
          >
            LinkedIn
          </a>
          <a
            href="mailto:hello@farahmand.dev"
            className="text-zinc-400 hover:text-emerald-400"
          >
            {tc("email")}
          </a>
        </div>
      </div>
    </div>
  );
}
