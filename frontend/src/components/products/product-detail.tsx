import Image from "next/image";

import { AddToCart } from "@/components/products/add-to-cart";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/currency";

type ProductDetailProps = {
  product: Product;
};

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-border/70 bg-muted shadow-sm">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            unoptimized
            className="object-cover"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-end bg-[linear-gradient(135deg,oklch(0.94_0.03_180),oklch(0.88_0.02_220))] p-6">
            <div className="rounded-full bg-background/85 px-4 py-2 text-sm font-medium text-muted-foreground">
              Product image unavailable
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {product.category ? (
              <Badge variant="secondary">{product.category.name}</Badge>
            ) : (
              <Badge variant="outline">Uncategorized</Badge>
            )}
            <span className="text-sm text-muted-foreground">
              Product details
            </span>
          </div>
          <h1 className="font-heading text-4xl tracking-tight text-balance">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold">{formatCurrency(product.price)}</p>
        </div>

        <p className="max-w-2xl text-base leading-8 text-muted-foreground">
          {product.description ??
            "This product does not have a detailed description yet."}
        </p>

        <AddToCart
          product={{
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            price: product.price,
          }}
        />
      </div>
    </section>
  );
}
