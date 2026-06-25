"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

const emptyForm = {
  title: "",
  content: "",
  excerpt: "",
  published: true,
};

export default function AdminBlogPage() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState(emptyForm);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const url = editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    loadPosts();
  }

  function startEdit(post: BlogPost) {
    setForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      published: post.published,
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

  return (
    <div dir="rtl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t("blogPosts")}</h1>
        <button
          onClick={() => {
            setForm(emptyForm);
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
          <input
            placeholder={t("titleLabel")}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          />
          <input
            placeholder={t("excerpt")}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          />
          <textarea
            placeholder={t("contentPlaceholder")}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
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
              <p className="font-medium text-white">{post.title}</p>
              <p className="text-sm text-zinc-500">
                {formatDate(post.createdAt, "fa")}
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
