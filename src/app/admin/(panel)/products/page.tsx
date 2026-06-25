"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { LocaleTabs } from "@/components/admin/LocaleTabs";
import { formatPrice, productTypeLabel } from "@/lib/utils";
import type { ProductAdmin, ProductTranslationFields } from "@/types";

const emptyTranslation = (): ProductTranslationFields => ({
  name: "",
  description: "",
  shortDesc: "",
  features: "",
});

const emptyForm = () => ({
  price: "",
  type: "software",
  inventory: "",
  translations: Object.fromEntries(
    routing.locales.map((locale) => [locale, emptyTranslation()])
  ) as ProductAdmin["translations"],
});

export default function AdminProductsPage() {
  const t = useTranslations("admin");
  const tt = useTranslations("productTypes");
  const tc = useTranslations("common");
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [activeLocale, setActiveLocale] = useState<Locale>("fa");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const typeLabels = {
    software: tt("software"),
    app: tt("app"),
    device: tt("device"),
  };

  async function loadProducts() {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function updateTranslation(
    locale: Locale,
    field: keyof ProductTranslationFields,
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
      price: parseFloat(form.price),
      type: form.type,
      inventory:
        form.type === "device" ? parseInt(form.inventory || "0", 10) : null,
      translations: form.translations,
    };

    const url = editingId
      ? `/api/admin/products/${editingId}`
      : "/api/admin/products";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm(emptyForm());
    setEditingId(null);
    setShowForm(false);
    loadProducts();
  }

  function startEdit(product: ProductAdmin) {
    setForm({
      price: String(product.price),
      type: product.type,
      inventory: product.inventory !== null ? String(product.inventory) : "",
      translations: {
        fa: product.translations.fa ?? emptyTranslation(),
        en: product.translations.en ?? emptyTranslation(),
      },
    });
    setEditingId(product.id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm(t("deleteProductConfirm"))) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  if (loading) return <p className="text-zinc-500">{tc("loading")}</p>;

  const active = form.translations[activeLocale] ?? emptyTranslation();

  return (
    <div dir="rtl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t("products")}</h1>
        <button
          onClick={() => {
            setForm(emptyForm());
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
        >
          {showForm ? t("cancel") : t("addProduct")}
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
              placeholder={tc("name")}
              value={active.name}
              onChange={(e) =>
                updateTranslation(activeLocale, "name", e.target.value)
              }
              required
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
            />
            <input
              placeholder={t("price")}
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
            />
          </div>
          <input
            placeholder={t("shortDescription")}
            value={active.shortDesc}
            onChange={(e) =>
              updateTranslation(activeLocale, "shortDesc", e.target.value)
            }
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
          <textarea
            placeholder={t("featuresPlaceholder")}
            value={active.features}
            onChange={(e) =>
              updateTranslation(activeLocale, "features", e.target.value)
            }
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
            >
              <option value="software">{tt("software")}</option>
              <option value="app">{tt("app")}</option>
              <option value="device">{tt("device")}</option>
            </select>
            {form.type === "device" && (
              <input
                placeholder={t("inventory")}
                type="number"
                value={form.inventory}
                onChange={(e) =>
                  setForm({ ...form, inventory: e.target.value })
                }
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
              />
            )}
          </div>
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-zinc-950"
          >
            {editingId ? t("updateProduct") : t("createProduct")}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900/80 text-start text-zinc-500">
            <tr>
              <th className="px-4 py-3">{tc("name")}</th>
              <th className="px-4 py-3">{t("typeLabel")}</th>
              <th className="px-4 py-3">{t("price")}</th>
              <th className="px-4 py-3">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {products.map((product) => (
              <tr key={product.id} className="text-zinc-300">
                <td className="px-4 py-3">
                  <div>{product.translations.fa?.name}</div>
                  <div className="text-xs text-zinc-500">
                    {product.translations.en?.name}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {productTypeLabel(product.type, typeLabels)}
                </td>
                <td className="px-4 py-3">{formatPrice(product.price, "fa")}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => startEdit(product)}
                    className="me-3 text-emerald-400 hover:underline"
                  >
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-400 hover:underline"
                  >
                    {t("delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
