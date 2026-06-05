import { ProductForm } from "@/components/admin/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/lib/backend/categories";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <Card className="rounded-[2rem] border border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle>Create product</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm categories={categories.data} mode="create" />
      </CardContent>
    </Card>
  );
}
