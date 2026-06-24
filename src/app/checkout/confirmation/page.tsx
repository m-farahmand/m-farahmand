import Link from "next/link";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="mb-6 text-6xl">✓</div>
      <h1 className="mb-4 text-3xl font-bold text-white">Order Placed!</h1>
      <p className="mb-2 text-zinc-400">
        Thank you for your order. We&apos;ll send payment instructions to your
        email shortly.
      </p>
      {orderId && (
        <p className="mb-8 text-sm text-zinc-500">
          Order ID: <span className="font-mono text-zinc-400">{orderId}</span>
        </p>
      )}
      <div className="flex justify-center gap-4">
        <Link
          href="/products"
          className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition hover:border-emerald-500/50"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
