import { SearchXIcon } from "lucide-react";

import { ProductCard } from "@/components/products/product-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/lib/types";

type ProductGridProps = {
  products?: Product[];
  skeletonCount?: number;
};

export function ProductGrid({
  products = [],
  skeletonCount = 0,
}: ProductGridProps) {
  if (skeletonCount > 0) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-border/70 bg-card"
          >
            <Skeleton className="aspect-[4/3] rounded-none" />
            <div className="flex flex-col gap-4 p-5">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Empty className="rounded-3xl border border-dashed border-border bg-card/70 py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>
          <EmptyTitle>No products match the current filters.</EmptyTitle>
          <EmptyDescription>
            Adjust the search term or switch categories to widen the result set.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index === 0} />
      ))}
    </div>
  );
}
