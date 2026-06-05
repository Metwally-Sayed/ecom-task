import { notFound } from "next/navigation";

import { AppShell } from "@/components/app/app-shell";
import { ProductDetail } from "@/components/products/product-detail";
import { BackendRequestError } from "@/lib/backend/client";
import { getProduct } from "@/lib/backend/products";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  let productResult;

  try {
    productResult = await getProduct(id);
  } catch (error) {
    if (
      error instanceof BackendRequestError &&
      error.statusCode === 404
    ) {
      notFound();
    }

    throw error;
  }

  return (
    <AppShell>
      <ProductDetail product={productResult.data} />
    </AppShell>
  );
}
