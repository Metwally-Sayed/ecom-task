import { AppShell } from "@/components/app/app-shell";
import { PaginationControls } from "@/components/app/pagination-controls";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductGrid } from "@/components/products/product-grid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCategories } from "@/lib/backend/categories";
import { getProducts } from "@/lib/backend/products";
import { productFiltersSchema } from "@/lib/schemas/product";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const parsedFilters = productFiltersSchema.parse({
    search: getFirstValue(resolvedSearchParams.search),
    category: getFirstValue(resolvedSearchParams.category),
    status: getFirstValue(resolvedSearchParams.status),
    page: getFirstValue(resolvedSearchParams.page),
    limit: getFirstValue(resolvedSearchParams.limit),
  });
  let categoriesResult = null;
  let productsResult = null;
  let hasBackendError = false;

  try {
    [categoriesResult, productsResult] = await Promise.all([
      getCategories(),
      getProducts(parsedFilters),
    ]);
  } catch {
    hasBackendError = true;
  }

  if (hasBackendError || !categoriesResult || !productsResult) {
    return (
      <AppShell>
        <section className="flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/70">
            Mini Shop
          </p>
          <h1 className="font-heading text-4xl tracking-tight text-balance sm:text-5xl">
            Browse products without waiting on the UI.
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            The catalog is available, but the backend data source is currently
            unreachable from this environment.
          </p>
        </section>

        <Alert>
          <AlertTitle>Product data is temporarily unavailable</AlertTitle>
          <AlertDescription>
            The page shell is working, but the backend could not load categories
            or products. Check the backend connection to Supabase and reload.
          </AlertDescription>
        </Alert>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/70">
          Mini Shop
        </p>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl tracking-tight text-balance sm:text-5xl">
              Browse products without waiting on the UI.
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Server-rendered catalog pages, URL-driven filters, and a clean
              mobile layout that stays fast as the dataset grows.
            </p>
          </div>
          <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
            {productsResult.meta.total} products
          </div>
        </div>
      </section>

      <ProductFilters
        key={`${parsedFilters.search ?? ""}-${parsedFilters.category ?? ""}-${parsedFilters.status}`}
        categories={categoriesResult.data}
        initialFilters={parsedFilters}
      />

      <ProductGrid products={productsResult.data} />

      <PaginationControls
        page={productsResult.meta.page}
        totalPages={productsResult.meta.totalPages}
        search={parsedFilters.search}
        category={parsedFilters.category}
        status={parsedFilters.status}
      />
    </AppShell>
  );
}
