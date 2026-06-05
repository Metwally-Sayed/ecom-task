"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/currency";

type AddToCartProps = {
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
    price: number;
  };
};

export function AddToCart({ product }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Order total</p>
        <p className="text-lg font-semibold">
          {formatCurrency(product.price * quantity)}
        </p>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-muted p-2">
        <span className="px-2 text-sm font-medium">Quantity</span>
        <div className="flex items-center gap-2">
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            -
          </Button>
          <span className="min-w-8 text-center text-sm font-medium">
            {quantity}
          </span>
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => setQuantity((current) => current + 1)}
          >
            +
          </Button>
        </div>
      </div>

      <Button
        size="lg"
        onClick={() => {
          addItem({
            productId: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            unitPrice: product.price,
            quantity,
          });
          toast.success(`${product.name} added to cart`);
        }}
      >
        Add to cart
      </Button>
    </div>
  );
}
