import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { mapBlogPost } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: t("title"),
    description: t("metaDescription"),
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const tc = await getTranslations("common");

  const posts = await prisma.blogPost.findMany({
    where: { published: true, lang: locale },
    orderBy: { createdAt: "desc" },
  });

  const mapped = posts.map(mapBlogPost);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 text-4xl font-bold text-white">{t("title")}</h1>
      <p className="mb-12 text-lg text-zinc-400">{t("subtitle")}</p>

      {mapped.length === 0 ? (
        <p className="text-zinc-500">{tc("noPosts")}</p>
      ) : (
        <div className="space-y-6">
          {mapped.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-emerald-500/30"
            >
              <time className="text-sm text-zinc-500">
                {formatDate(post.createdAt, locale as Locale)}
              </time>
              <h2 className="mt-2 text-xl font-semibold text-white">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-emerald-400"
                >
                  {post.title}
                </Link>
              </h2>
              {post.excerpt && (
                <p className="mt-2 text-zinc-400">{post.excerpt}</p>
              )}
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-block text-sm text-emerald-400 hover:underline"
              >
                {tc("readMore")}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
