import { z } from "zod";

export const userFiltersSchema = z.object({
  search: z.string().optional(),
  role: z.enum(["all", "admin", "customer"]).default("all"),
  status: z.enum(["all", "active", "deactivated", "blocked"]).default("all"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const createUserFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["customer", "admin"]),
});

export const updateUserFormSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Valid email is required").optional(),
  role: z.enum(["customer", "admin"]).optional(),
  status: z.enum(["active", "deactivated", "blocked"]).optional(),
});

export const updateProfileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
});

export type UserFiltersSchema = z.infer<typeof userFiltersSchema>;
export type CreateUserFormSchema = z.infer<typeof createUserFormSchema>;
export type UpdateUserFormSchema = z.infer<typeof updateUserFormSchema>;
export type UpdateProfileFormSchema = z.infer<typeof updateProfileFormSchema>;
