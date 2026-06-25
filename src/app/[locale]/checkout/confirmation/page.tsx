import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ orderId?: string }>;
};

export default async function ConfirmationPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { orderId } = await searchParams;
  const t = await getTranslations("confirmation");

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="mb-6 text-6xl">✓</div>
      <h1 className="mb-4 text-3xl font-bold text-white">{t("title")}</h1>
      <p className="mb-2 text-zinc-400">{t("thankYou")}</p>
      {orderId && (
        <p className="mb-8 text-sm text-zinc-500">
          {t("orderId")}{" "}
          <span className="font-mono text-zinc-400">{orderId}</span>
        </p>
      )}
      <div className="flex justify-center gap-4">
        <Link
          href="/products"
          className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition hover:border-emerald-500/50"
        >
          {t("continueShopping")}
        </Link>
        <Link
          href="/"
          className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
        >
          {t("backToHome")}
        </Link>
      </div>
    </div>
  );
}
