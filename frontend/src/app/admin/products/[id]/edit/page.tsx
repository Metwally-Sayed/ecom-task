import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/lib/backend/categories";
import { getProducts } from "@/lib/backend/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ status: "all", page: 1, limit: 100 }),
  ]);

  const product = products.data.find((item) => item.id === id);

  if (!product || !product.category) {
    notFound();
  }

  return (
    <Card className="rounded-[2rem] border border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle>Edit product</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm
          categories={categories.data}
          mode="edit"
          initialValues={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            categoryId: product.category.id,
            isActive: product.isActive,
          }}
        />
      </CardContent>
    </Card>
  );
}
