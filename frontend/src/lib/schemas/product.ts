import { z } from "zod";

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["all", "active", "inactive"]).default("active"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  imageUrl: z
    .union([z.url("Image URL must be valid"), z.literal("")])
    .optional(),
  categoryId: z.uuid("Category is required"),
  isActive: z.boolean().optional(),
});

export type ProductFiltersSchema = z.infer<typeof productFiltersSchema>;
export type ProductFormSchema = z.infer<typeof productFormSchema>;
