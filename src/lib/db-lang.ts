import { prisma } from "@/lib/prisma";
import { routing, type Locale } from "@/i18n/routing";
import type {
  BlogPost,
  Product,
  ProductAdmin,
  TimelineEntryAdmin,
  BlogPostAdmin,
} from "@/types";

type ProductTranslationInput = {
  name: string;
  description: string;
  shortDesc?: string;
  features?: string;
};

type TimelineTranslationInput = {
  title: string;
  description: string;
  tags?: string;
};

type BlogTranslationInput = {
  title: string;
  content: string;
  excerpt?: string;
};

function toTranslationRecord<T>(
  rows: Array<{ lang: string } & T>
): Partial<Record<Locale, T>> {
  const record: Partial<Record<Locale, T>> = {};
  for (const row of rows) {
    if (routing.locales.includes(row.lang as Locale)) {
      const { lang: _lang, ...rest } = row;
      record[row.lang as Locale] = rest as T;
    }
  }
  return record;
}

export async function upsertProductByLang(
  slug: string,
  shared: {
    price: number;
    type: string;
    inventory: number | null;
  },
  translations: Record<Locale, ProductTranslationInput>
) {
  for (const lang of routing.locales) {
    const data = translations[lang];
    await prisma.product.upsert({
      where: { slug_lang: { slug, lang } },
      create: {
        slug,
        lang,
        name: data.name,
        description: data.description,
        shortDesc: data.shortDesc ?? "",
        features: data.features ?? "",
        price: shared.price,
        type: shared.type,
        inventory: shared.inventory,
      },
      update: {
        name: data.name,
        description: data.description,
        shortDesc: data.shortDesc ?? "",
        features: data.features ?? "",
        price: shared.price,
        type: shared.type,
        inventory: shared.inventory,
      },
    });
  }
}

export async function upsertTimelineByLang(
  year: number,
  sortOrder: number,
  translations: Record<Locale, TimelineTranslationInput>
) {
  for (const lang of routing.locales) {
    const data = translations[lang];
    await prisma.timelineEntry.upsert({
      where: { year_sortOrder_lang: { year, sortOrder, lang } },
      create: {
        year,
        sortOrder,
        lang,
        title: data.title,
        description: data.description,
        tags: data.tags ?? "",
      },
      update: {
        title: data.title,
        description: data.description,
        tags: data.tags ?? "",
      },
    });
  }
}

export async function upsertBlogByLang(
  slug: string,
  published: boolean,
  translations: Record<Locale, BlogTranslationInput>
) {
  for (const lang of routing.locales) {
    const data = translations[lang];
    await prisma.blogPost.upsert({
      where: { slug_lang: { slug, lang } },
      create: {
        slug,
        lang,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt ?? "",
        published,
      },
      update: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt ?? "",
        published,
      },
    });
  }
}

export async function deleteProductBySlug(slug: string) {
  await prisma.product.deleteMany({ where: { slug } });
}

export async function deleteTimelineGroup(year: number, sortOrder: number) {
  await prisma.timelineEntry.deleteMany({ where: { year, sortOrder } });
}

export async function deleteBlogBySlug(slug: string) {
  await prisma.blogPost.deleteMany({ where: { slug } });
}

export async function getProductMediaBySlug(slug: string) {
  const primary = await prisma.product.findUnique({
    where: { slug_lang: { slug, lang: routing.defaultLocale } },
    include: { media: true },
  });
  return primary?.media ?? [];
}

export async function serializeProductsForAdmin(): Promise<ProductAdmin[]> {
  const rows = await prisma.product.findMany({
    where: { lang: routing.defaultLocale },
    include: { media: true },
    orderBy: { createdAt: "desc" },
  });

  const result: ProductAdmin[] = [];

  for (const primary of rows) {
    const siblings = await prisma.product.findMany({
      where: { slug: primary.slug },
    });

    result.push({
      id: primary.id,
      slug: primary.slug,
      price: primary.price,
      type: primary.type as ProductAdmin["type"],
      inventory: primary.inventory,
      createdAt: primary.createdAt.toISOString(),
      media: primary.media,
      translations: toTranslationRecord(
        siblings.map((row) => ({
          lang: row.lang,
          name: row.name,
          description: row.description,
          shortDesc: row.shortDesc,
          features: row.features,
        }))
      ),
    });
  }

  return result;
}

export async function serializeTimelineForAdmin(): Promise<TimelineEntryAdmin[]> {
  const rows = await prisma.timelineEntry.findMany({
    where: { lang: routing.defaultLocale },
    orderBy: [{ year: "asc" }, { sortOrder: "asc" }],
  });

  const result: TimelineEntryAdmin[] = [];

  for (const primary of rows) {
    const siblings = await prisma.timelineEntry.findMany({
      where: { year: primary.year, sortOrder: primary.sortOrder },
    });

    result.push({
      id: primary.id,
      year: primary.year,
      sortOrder: primary.sortOrder,
      createdAt: primary.createdAt.toISOString(),
      translations: toTranslationRecord(
        siblings.map((row) => ({
          lang: row.lang,
          title: row.title,
          description: row.description,
          tags: row.tags,
        }))
      ),
    });
  }

  return result;
}

export async function serializeBlogPostsForAdmin(): Promise<BlogPostAdmin[]> {
  const rows = await prisma.blogPost.findMany({
    where: { lang: routing.defaultLocale },
    orderBy: { createdAt: "desc" },
  });

  const result: BlogPostAdmin[] = [];

  for (const primary of rows) {
    const siblings = await prisma.blogPost.findMany({
      where: { slug: primary.slug },
    });

    result.push({
      id: primary.id,
      slug: primary.slug,
      published: primary.published,
      createdAt: primary.createdAt.toISOString(),
      translations: toTranslationRecord(
        siblings.map((row) => ({
          lang: row.lang,
          title: row.title,
          content: row.content,
          excerpt: row.excerpt,
        }))
      ),
    });
  }

  return result;
}

export async function resolveProductSlugFromId(id: string): Promise<string | null> {
  const product = await prisma.product.findUnique({ where: { id } });
  return product?.slug ?? null;
}

export async function resolveTimelineGroupFromId(
  id: string
): Promise<{ year: number; sortOrder: number } | null> {
  const entry = await prisma.timelineEntry.findUnique({ where: { id } });
  if (!entry) return null;
  return { year: entry.year, sortOrder: entry.sortOrder };
}

export async function resolveBlogSlugFromId(id: string): Promise<string | null> {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  return post?.slug ?? null;
}
