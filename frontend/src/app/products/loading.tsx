import { ProductGrid } from "@/components/products/product-grid";

export default function ProductsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3">
        <div className="h-4 w-24 rounded-full bg-muted" />
        <div className="h-10 w-72 rounded-full bg-muted" />
        <div className="h-4 w-full max-w-xl rounded-full bg-muted" />
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="h-24 rounded-2xl bg-card ring-1 ring-border" />
        <div className="h-24 rounded-2xl bg-card ring-1 ring-border" />
      </div>
      <ProductGrid skeletonCount={8} />
    </div>
  );
}
