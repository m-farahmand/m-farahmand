import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().min(1),
  shortDesc: z.string().optional(),
  price: z.number().positive(),
  type: z.enum(["software", "app", "device"]),
  inventory: z.number().int().nonnegative().nullable().optional(),
  features: z.string().optional(),
});

export const timelineSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const blogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  published: z.boolean().optional(),
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
