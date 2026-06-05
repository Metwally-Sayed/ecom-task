"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { productFormSchema } from "@/lib/schemas/product";
import type { Category } from "@/lib/types";

type ProductFormProps = {
  categories: Category[];
  mode: "create" | "edit";
  initialValues?: {
    id?: string;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    categoryId: string;
    isActive?: boolean;
  };
};

export function ProductForm({
  categories,
  mode,
  initialValues,
}: ProductFormProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [categoryId, setCategoryId] = useState(
    initialValues?.categoryId ?? categories[0]?.id ?? "",
  );
  const [isActive, setIsActive] = useState(initialValues?.isActive ?? true);
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? "");

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/uploads/product-image", {
      method: "POST",
      body: formData,
    });

    const result = (await response.json().catch(() => null)) as
      | { data?: { imageUrl?: string }; message?: string }
      | null;

    if (!response.ok || !result?.data?.imageUrl) {
      throw new Error(result?.message ?? "Unable to upload image");
    }

    return result.data.imageUrl;
  }

  async function handleSubmit(formData: FormData) {
    setErrorMessage(null);
    setIsPending(true);

    try {
      const selectedFile = formData.get("imageFile");
      let resolvedImageUrl = imageUrl;

      if (selectedFile instanceof File && selectedFile.size > 0) {
        resolvedImageUrl = await handleUpload(selectedFile);
        setImageUrl(resolvedImageUrl);
      }

      const payload = productFormSchema.parse({
        name: String(formData.get("name") ?? ""),
        description: String(formData.get("description") ?? ""),
        price: String(formData.get("price") ?? ""),
        imageUrl: resolvedImageUrl,
        categoryId,
        isActive,
      });

      const endpoint =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${initialValues?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.message ?? "Unable to save product");
      }

      startTransition(() => {
        router.replace("/admin/products");
        router.refresh();
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save product",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="product-name">Name</FieldLabel>
          <Input
            id="product-name"
            name="name"
            defaultValue={initialValues?.name ?? ""}
            placeholder="Product name"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="product-description">Description</FieldLabel>
          <Textarea
            id="product-description"
            name="description"
            defaultValue={initialValues?.description ?? ""}
            placeholder="Product description"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="product-price">Price</FieldLabel>
          <Input
            id="product-price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={initialValues?.price ?? 0}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="product-category">Category</FieldLabel>
          <Select value={categoryId} onValueChange={(value) => setCategoryId(value ?? "")}>
            <SelectTrigger id="product-category" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="product-image-url">Image URL</FieldLabel>
          <Input
            id="product-image-url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://..."
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="product-image-file">Upload image</FieldLabel>
          <Input id="product-image-file" name="imageFile" type="file" accept="image/*" />
        </Field>

        {mode === "edit" ? (
          <Field orientation="horizontal">
            <FieldLabel htmlFor="product-active">Active</FieldLabel>
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(Boolean(checked))}
              id="product-active"
            />
          </Field>
        ) : null}
      </FieldGroup>

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

      <Button size="lg" type="submit" disabled={isPending}>
        {isPending
          ? "Saving..."
          : mode === "create"
            ? "Create product"
            : "Update product"}
      </Button>
    </form>
  );
}
