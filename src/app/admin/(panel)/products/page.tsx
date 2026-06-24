"use client";

import { useEffect, useState } from "react";
import { formatPrice, productTypeLabel } from "@/lib/utils";
import type { Product } from "@/types";

const emptyForm = {
  name: "",
  description: "",
  shortDesc: "",
  price: "",
  type: "software",
  inventory: "",
  features: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      shortDesc: form.shortDesc,
      price: parseFloat(form.price),
      type: form.type,
      inventory:
        form.type === "device" ? parseInt(form.inventory || "0", 10) : null,
      features: form.features,
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

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    loadProducts();
  }

  function startEdit(product: Product) {
    setForm({
      name: product.name,
      description: product.description,
      shortDesc: product.shortDesc,
      price: String(product.price),
      type: product.type,
      inventory: product.inventory !== null ? String(product.inventory) : "",
      features: product.features,
    });
    setEditingId(product.id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  if (loading) return <p className="text-zinc-500">Loading...</p>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
        >
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
            />
            <input
              placeholder="Price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
            />
          </div>
          <input
            placeholder="Short description"
            value={form.shortDesc}
            onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          />
          <textarea
            placeholder="Full description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          />
          <textarea
            placeholder="Features (one per line)"
            value={form.features}
            onChange={(e) => setForm({ ...form, features: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
            >
              <option value="software">Software</option>
              <option value="app">App</option>
              <option value="device">Device</option>
            </select>
            {form.type === "device" && (
              <input
                placeholder="Inventory"
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
            {editingId ? "Update" : "Create"} Product
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900/80 text-left text-zinc-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {products.map((product) => (
              <tr key={product.id} className="text-zinc-300">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">
                  {productTypeLabel(product.type)}
                </td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => startEdit(product)}
                    className="mr-3 text-emerald-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
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
