"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { TimelineEntry } from "@/types";

const emptyForm = {
  year: "",
  title: "",
  description: "",
  tags: "",
  sortOrder: "0",
};

export default function AdminTimelinePage() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [form, setForm] = useState(emptyForm);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      year: parseInt(form.year, 10),
      title: form.title,
      description: form.description,
      tags: form.tags,
      sortOrder: parseInt(form.sortOrder, 10),
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

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    loadEntries();
  }

  function startEdit(entry: TimelineEntry) {
    setForm({
      year: String(entry.year),
      title: entry.title,
      description: entry.description,
      tags: entry.tags,
      sortOrder: String(entry.sortOrder),
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

  return (
    <div dir="rtl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t("timeline")}</h1>
        <button
          onClick={() => {
            setForm(emptyForm);
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
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          />
          <textarea
            placeholder={t("fullDescription")}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          />
          <input
            placeholder={t("tagsPlaceholder")}
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
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
              <span className="font-medium text-white">{entry.title}</span>
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
