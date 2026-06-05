"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBagIcon, Trash2Icon } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";

export function CartSheet() {
  const { items, itemCount, subtotal, removeItem } = useCart();
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "default" }),
          "fixed right-4 bottom-4 z-40 shadow-lg md:right-6 md:bottom-6",
        )}
      >
        <ShoppingBagIcon data-icon="inline-start" />
        Cart
        <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
          {itemCount}
        </span>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md gap-0 p-0">
        <SheetHeader className="border-b border-border pr-14">
          <SheetTitle>Your cart</SheetTitle>
          <SheetDescription>
            Review items before heading to checkout.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <ShoppingBagIcon className="text-muted-foreground" />
              <div>
                <p className="font-medium">Your cart is empty.</p>
                <p className="text-sm text-muted-foreground">
                  Add products from the catalog to start a checkout.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {items.map((item, index) => (
                <div key={item.productId}>
                  <div className="flex gap-4 px-4 py-4">
                    <div className="relative size-18 overflow-hidden rounded-2xl bg-muted">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="72px"
                        />
                      ) : null}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.unitPrice)} each
                          </p>
                        </div>
                        <button
                          type="button"
                          className="text-muted-foreground transition-colors hover:text-foreground"
                          onClick={() => removeItem(item.productId)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2Icon className="size-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Qty {item.quantity}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < items.length - 1 ? <Separator /> : null}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border bg-background p-4">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            Checkout
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
