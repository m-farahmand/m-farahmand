import { routing, type Locale } from "@/i18n/routing";
import type { BlogPost, Product, ProductType, TimelineEntry } from "@/types";
import type { Product as PrismaProduct, BlogPost as PrismaBlogPost, TimelineEntry as PrismaTimelineEntry } from "@prisma/client";

type ProductWithMedia = PrismaProduct & { media?: Product["media"] };

export function getLocaleFromRequest(request: Request): Locale {
  const locale = new URL(request.url).searchParams.get("locale");
  if (locale && routing.locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  return routing.defaultLocale;
}

export function mapProduct(row: ProductWithMedia): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    shortDesc: row.shortDesc,
    features: row.features,
    price: row.price,
    type: row.type as ProductType,
    inventory: row.inventory,
    createdAt: row.createdAt.toISOString(),
    media: row.media,
  };
}

export function mapTimelineEntry(row: PrismaTimelineEntry): TimelineEntry {
  return {
    id: row.id,
    year: row.year,
    title: row.title,
    description: row.description,
    tags: row.tags,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
  };
}

export function mapBlogPost(row: PrismaBlogPost): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    published: row.published,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function attachProductMedia(
  products: ProductWithMedia[],
  fetchMediaForSlug: (slug: string) => Promise<Product["media"]>
): Promise<Product[]> {
  return Promise.all(
    products.map(async (row) => {
      const media =
        row.media && row.media.length > 0
          ? row.media
          : await fetchMediaForSlug(row.slug);
      return mapProduct({ ...row, media });
    })
  );
}
