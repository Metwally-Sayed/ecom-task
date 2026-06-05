import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.uuid("Product is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const createOrderSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "Order must contain at least one item"),
});

export const orderStatusSchema = z.object({
  status: z.enum(["Pending", "Processing", "Completed", "Cancelled"]),
});

export type CheckoutItemSchema = z.infer<typeof checkoutItemSchema>;
export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
export type OrderStatusSchema = z.infer<typeof orderStatusSchema>;
