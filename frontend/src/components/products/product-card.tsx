import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/currency";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <Card className="h-full rounded-2xl border border-border/70 bg-card/90 py-0 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-muted">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
              priority={priority}
            />
          ) : (
            <div className="flex h-full items-end bg-[linear-gradient(135deg,oklch(0.94_0.03_180),oklch(0.88_0.02_220))] p-5">
              <div className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                No image
              </div>
            </div>
          )}
        </div>

        <CardHeader className="gap-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg leading-6">{product.name}</CardTitle>
            <span className="text-base font-semibold text-foreground">
              {formatCurrency(product.price)}
            </span>
          </div>
          <CardDescription className="line-clamp-2 min-h-10 text-sm leading-6">
            {product.description ?? "No description available for this product yet."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {product.category ? (
            <Badge variant="secondary">{product.category.name}</Badge>
          ) : (
            <Badge variant="outline">Uncategorized</Badge>
          )}
        </CardContent>

        <CardFooter className="mt-auto justify-between rounded-b-2xl bg-muted/40">
          <span className="text-sm text-muted-foreground">View details</span>
          <span className="text-sm font-medium text-foreground">Open</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
