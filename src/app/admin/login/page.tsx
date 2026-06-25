"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function AdminLoginPage() {
  const router = useRouter();
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("loginFailed"));
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("loginFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4" dir="rtl">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
        <h1 className="mb-2 text-2xl font-bold text-white">{t("login")}</h1>
        <p className="mb-8 text-sm text-zinc-500">{t("loginSubtitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-400">{tc("email")}</label>
            <input
              name="email"
              type="email"
              required
              defaultValue="admin@farahmand.dev"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-400">{t("password")}</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none focus:border-emerald-500"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading ? t("signingIn") : t("signIn")}
          </button>
        </form>
      </div>
    </div>
  );
}
