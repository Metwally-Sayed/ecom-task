"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils/currency";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleCheckout() {
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage("Add at least one product before checking out.");
      return;
    }

    setIsPending(true);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    });

    const result = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    setIsPending(false);

    if (!response.ok) {
      if (response.status === 401) {
        startTransition(() => {
          router.replace("/login?next=/checkout");
        });
        return;
      }

      setErrorMessage(result?.message ?? "Unable to place order");
      return;
    }

    clearCart();
    toast.success("Order placed successfully");

    startTransition(() => {
      router.replace("/account");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl">Order summary</h2>
            <p className="text-sm text-muted-foreground">
              Review the cart before sending it to the backend.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Your cart is empty. Add products from the catalog before checkout.
          </p>
        ) : (
          <div className="flex flex-col">
            {items.map((item, index) => (
              <div key={item.productId}>
                <div className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty {item.quantity} x {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </p>
                </div>
                {index < items.length - 1 ? <Separator /> : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <aside className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
        <h2 className="font-heading text-xl">Checkout</h2>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">{formatCurrency(0)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-medium">Total</span>
            <span className="text-lg font-semibold">
              {formatCurrency(subtotal)}
            </span>
          </div>
        </div>

        {errorMessage ? (
          <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
        ) : null}

        <Button
          size="lg"
          className="mt-6 w-full"
          disabled={isPending || items.length === 0}
          onClick={handleCheckout}
        >
          {isPending ? "Submitting order..." : "Place order"}
        </Button>
      </aside>
    </div>
  );
}
