import { z } from "zod";

const productTranslationSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  shortDesc: z.string().optional(),
  features: z.string().optional(),
});

const timelineTranslationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.string().optional(),
});

const blogTranslationSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
});

const translationsSchema = <T extends z.ZodType>(schema: T) =>
  z.object({
    fa: schema,
    en: schema,
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const productSchema = z.object({
  slug: z.string().min(1).optional(),
  price: z.number().positive(),
  type: z.enum(["software", "app", "device"]),
  inventory: z.number().int().nonnegative().nullable().optional(),
  translations: translationsSchema(productTranslationSchema),
});

export const timelineSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  sortOrder: z.number().int().optional(),
  translations: translationsSchema(timelineTranslationSchema),
});

export const blogPostSchema = z.object({
  slug: z.string().min(1).optional(),
  published: z.boolean().optional(),
  translations: translationsSchema(blogTranslationSchema),
});

export const orderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "paid", "delivered"]),
});
