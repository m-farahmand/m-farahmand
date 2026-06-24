import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Blog",
  description: "Technical posts, product updates, and insights.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 text-4xl font-bold text-white">Blog</h1>
      <p className="mb-12 text-lg text-zinc-400">
        Technical posts, architecture insights, and product updates.
      </p>

      {posts.length === 0 ? (
        <p className="text-zinc-500">No posts published yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-emerald-500/30"
            >
              <time className="text-sm text-zinc-500">
                {formatDate(post.createdAt)}
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
                Read more &rarr;
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
