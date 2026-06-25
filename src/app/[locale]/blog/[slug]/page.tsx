import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: t("postNotFound") };
  return { title: post.title, description: post.excerpt };
}

function renderContent(content: string) {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-3">
          {line.slice(3)}
        </h2>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h3 key={i} className="text-xl font-semibold text-zinc-200 mt-6 mb-2">
          {line.slice(4)}
        </h3>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={i} className="ms-4 text-zinc-400">
          {line.slice(2)}
        </li>
      );
    }
    if (/^\d+\.\s/.test(line)) {
      return (
        <li key={i} className="ms-4 list-decimal text-zinc-400">
          {line.replace(/^\d+\.\s/, "")}
        </li>
      );
    }
    if (line.trim() === "") return <br key={i} />;
    return (
      <p key={i} className="mb-4 leading-relaxed text-zinc-400">
        {line}
      </p>
    );
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tc = await getTranslations("common");

  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || !post.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link
        href="/blog"
        className="mb-8 inline-block text-sm text-emerald-400 hover:underline"
      >
        {tc("backToBlog")}
      </Link>
      <time className="text-sm text-zinc-500">
        {formatDate(post.createdAt, locale as Locale)}
      </time>
      <h1 className="mt-2 mb-8 text-4xl font-bold text-white">{post.title}</h1>
      <div className="prose-blog">{renderContent(post.content)}</div>
    </article>
  );
}
