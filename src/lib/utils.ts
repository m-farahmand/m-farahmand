export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
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

export function productTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    software: "Software",
    app: "App",
    device: "Device",
  };
  return labels[type] || type;
}

export function orderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    paid: "Paid",
    delivered: "Delivered",
  };
  return labels[status] || status;
}
