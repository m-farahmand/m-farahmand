"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { LocaleTabs } from "@/components/admin/LocaleTabs";
import { formatDate } from "@/lib/utils";
import type { BlogPostAdmin, BlogTranslationFields } from "@/types";

const emptyTranslation = (): BlogTranslationFields => ({
  title: "",
  content: "",
  excerpt: "",
});

const emptyForm = () => ({
  published: true,
  translations: Object.fromEntries(
    routing.locales.map((locale) => [locale, emptyTranslation()])
  ) as BlogPostAdmin["translations"],
});

export default function AdminBlogPage() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const [posts, setPosts] = useState<BlogPostAdmin[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [activeLocale, setActiveLocale] = useState<Locale>("fa");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    const res = await fetch("/api/admin/blog");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function updateTranslation(
    locale: Locale,
    field: keyof BlogTranslationFields,
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

    const url = editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm(emptyForm());
    setEditingId(null);
    setShowForm(false);
    loadPosts();
  }

  function startEdit(post: BlogPostAdmin) {
    setForm({
      published: post.published,
      translations: {
        fa: post.translations.fa ?? emptyTranslation(),
        en: post.translations.en ?? emptyTranslation(),
      },
    });
    setEditingId(post.id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm(t("deletePostConfirm"))) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    loadPosts();
  }

  if (loading) return <p className="text-zinc-500">{tc("loading")}</p>;

  const active = form.translations[activeLocale] ?? emptyTranslation();

  return (
    <div dir="rtl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t("blogPosts")}</h1>
        <button
          onClick={() => {
            setForm(emptyForm());
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
        >
          {showForm ? t("cancel") : t("newPost")}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
        >
          <LocaleTabs active={activeLocale} onChange={setActiveLocale} />

          <input
            placeholder={t("titleLabel")}
            value={active.title}
            onChange={(e) =>
              updateTranslation(activeLocale, "title", e.target.value)
            }
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          />
          <input
            placeholder={t("excerpt")}
            value={active.excerpt}
            onChange={(e) =>
              updateTranslation(activeLocale, "excerpt", e.target.value)
            }
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          />
          <textarea
            placeholder={t("contentPlaceholder")}
            value={active.content}
            onChange={(e) =>
              updateTranslation(activeLocale, "content", e.target.value)
            }
            required
            rows={8}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-sm text-white"
          />
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm({ ...form, published: e.target.checked })
              }
            />
            {t("published")}
          </label>
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-zinc-950"
          >
            {editingId ? t("updatePost") : t("createPost")}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <div>
              <p className="font-medium text-white">
                {post.translations.fa?.title}
              </p>
              <p className="text-sm text-zinc-500">
                {post.translations.en?.title} · {formatDate(post.createdAt, "fa")}
                {!post.published && ` · ${t("draft")}`}
              </p>
            </div>
            <div>
              <button
                onClick={() => startEdit(post)}
                className="ms-3 text-sm text-emerald-400 hover:underline"
              >
                {t("edit")}
              </button>
              <button
                onClick={() => handleDelete(post.id)}
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
