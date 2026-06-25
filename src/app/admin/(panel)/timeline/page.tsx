"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { LocaleTabs } from "@/components/admin/LocaleTabs";
import type { TimelineEntryAdmin, TimelineTranslationFields } from "@/types";

const emptyTranslation = (): TimelineTranslationFields => ({
  title: "",
  description: "",
  tags: "",
});

const emptyForm = () => ({
  year: "",
  sortOrder: "0",
  translations: Object.fromEntries(
    routing.locales.map((locale) => [locale, emptyTranslation()])
  ) as TimelineEntryAdmin["translations"],
});

export default function AdminTimelinePage() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const [entries, setEntries] = useState<TimelineEntryAdmin[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [activeLocale, setActiveLocale] = useState<Locale>("fa");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadEntries() {
    const res = await fetch("/api/admin/timeline");
    const data = await res.json();
    setEntries(data);
    setLoading(false);
  }

  useEffect(() => {
    loadEntries();
  }, []);

  function updateTranslation(
    locale: Locale,
    field: keyof TimelineTranslationFields,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [locale]: {
          ...(prev.translations[locale] ?? emptyTranslation()),
          [field]: value,
        },
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      year: parseInt(form.year, 10),
      sortOrder: parseInt(form.sortOrder, 10),
      translations: form.translations,
    };

    const url = editingId
      ? `/api/admin/timeline/${editingId}`
      : "/api/admin/timeline";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm(emptyForm());
    setEditingId(null);
    setShowForm(false);
    loadEntries();
  }

  function startEdit(entry: TimelineEntryAdmin) {
    setForm({
      year: String(entry.year),
      sortOrder: String(entry.sortOrder),
      translations: {
        fa: entry.translations.fa ?? emptyTranslation(),
        en: entry.translations.en ?? emptyTranslation(),
      },
    });
    setEditingId(entry.id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm(t("deleteEntryConfirm"))) return;
    await fetch(`/api/admin/timeline/${id}`, { method: "DELETE" });
    loadEntries();
  }

  if (loading) return <p className="text-zinc-500">{tc("loading")}</p>;

  const active = form.translations[activeLocale] ?? emptyTranslation();

  return (
    <div dir="rtl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t("timeline")}</h1>
        <button
          onClick={() => {
            setForm(emptyForm());
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
        >
          {showForm ? t("cancel") : t("addEntry")}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
        >
          <LocaleTabs active={activeLocale} onChange={setActiveLocale} />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              placeholder={t("year")}
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              required
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
            />
            <input
              placeholder={t("sortOrder")}
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: e.target.value })
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
            />
          </div>
          <input
            placeholder={t("titleLabel")}
            value={active.title}
            onChange={(e) =>
              updateTranslation(activeLocale, "title", e.target.value)
            }
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          />
          <textarea
            placeholder={t("fullDescription")}
            value={active.description}
            onChange={(e) =>
              updateTranslation(activeLocale, "description", e.target.value)
            }
            required
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          />
          <input
            placeholder={t("tagsPlaceholder")}
            value={active.tags}
            onChange={(e) =>
              updateTranslation(activeLocale, "tags", e.target.value)
            }
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-zinc-950"
          >
            {editingId ? t("updateEntry") : t("createEntry")}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <div>
              <span className="ms-3 rounded-full bg-emerald-500/10 px-2 py-0.5 text-sm font-bold text-emerald-400">
                {entry.year}
              </span>
              <span className="font-medium text-white">
                {entry.translations.fa?.title}
              </span>
              <span className="ms-2 text-sm text-zinc-500">
                / {entry.translations.en?.title}
              </span>
            </div>
            <div>
              <button
                onClick={() => startEdit(entry)}
                className="ms-3 text-sm text-emerald-400 hover:underline"
              >
                {t("edit")}
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-sm text-red-400 hover:underline"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
