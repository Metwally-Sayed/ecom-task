import Link from "next/link";

import { AdminProductFilters } from "@/components/admin/admin-product-filters";
import { ProductTable } from "@/components/admin/product-table";
import { PaginationControls } from "@/components/app/pagination-controls";
import { buttonVariants } from "@/components/ui/button";
import { getCategories } from "@/lib/backend/categories";
import { getProducts } from "@/lib/backend/products";
import type { ProductStatusFilter } from "@/lib/backend/products";
import { cn } from "@/lib/utils";

const LIMIT = 10;

type AdminProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    page?: string;
  }>;
};

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const params = await searchParams;
  const status = (["all", "active", "inactive"].includes(params.status ?? "")
    ? params.status
    : "all") as ProductStatusFilter;
  const page = Math.max(1, Number(params.page) || 1);

  const [products, categories] = await Promise.all([
    getProducts({
      search: params.search,
      category: params.category,
      status,
      page,
      limit: LIMIT,
    }),
    getCategories(),
  ]);

  const meta = "totalPages" in products.meta ? products.meta : null;

  return (
    <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            Create, update, and deactivate products from the existing backend.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className={cn(buttonVariants({ size: "default" }))}
        >
          New product
        </Link>
      </div>

      <div className="mb-4">
        <AdminProductFilters
          categories={categories.data}
          initialSearch={params.search}
          initialCategory={params.category}
          initialStatus={status}
        />
      </div>

      {meta && (
        <p className="mb-2 text-sm text-muted-foreground">
          {meta.total} product{meta.total !== 1 ? "s" : ""}
        </p>
      )}

      <ProductTable products={products.data} />

      {meta && (
        <div className="mt-4">
          <PaginationControls
            basePath="/admin/products"
            page={meta.page}
            totalPages={meta.totalPages}
            search={params.search}
            category={params.category}
            status={status}
          />
        </div>
      )}
    </section>
  );
}
