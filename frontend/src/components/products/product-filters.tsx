"use client";

import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductFiltersSchema } from "@/lib/schemas/product";
import type { Category } from "@/lib/types";

type ProductFiltersProps = {
  categories: Category[];
  initialFilters: ProductFiltersSchema;
};

export function ProductFilters({
  categories,
  initialFilters,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialFilters.search ?? "");
  const deferredSearch = useDeferredValue(search);

  const baseQuery = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  const replaceFilters = useCallback(
    (next: {
      search?: string;
      category?: string;
      status?: string;
    }) => {
      const params = new URLSearchParams(baseQuery.toString());

      if (next.search) {
        params.set("search", next.search);
      } else {
        params.delete("search");
      }

      if (next.category) {
        params.set("category", next.category);
      } else {
        params.delete("category");
      }

      if (next.status && next.status !== "active") {
        params.set("status", next.status);
      } else {
        params.delete("status");
      }

      params.delete("page");

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [baseQuery, pathname, router],
  );

  useEffect(() => {
    const currentSearch = searchParams.get("search") ?? "";
    const nextSearch = deferredSearch.trim();

    if (currentSearch === nextSearch) {
      return;
    }

    replaceFilters({
      search: nextSearch,
      category: initialFilters.category,
      status: initialFilters.status,
    });
  }, [
    deferredSearch,
    initialFilters.category,
    initialFilters.status,
    replaceFilters,
    searchParams,
  ]);

  return (
    <section className="grid gap-3 rounded-3xl border border-border/70 bg-card/80 p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_12rem_10rem]">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="product-search">Search</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>
                <SearchIcon />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="product-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by product title"
            />
          </InputGroup>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="category-filter">Category</FieldLabel>
          <Select
            value={initialFilters.category ?? "all"}
            onValueChange={(value) =>
              replaceFilters({
                search: deferredSearch.trim(),
                category: value && value !== "all" ? value : undefined,
                status: initialFilters.status,
              })
            }
          >
            <SelectTrigger id="category-filter" className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="status-filter">Status</FieldLabel>
          <Select
            value={initialFilters.status}
            onValueChange={(value) =>
              replaceFilters({
                search: deferredSearch.trim(),
                category: initialFilters.category,
                status: value ?? undefined,
              })
            }
          >
            <SelectTrigger id="status-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="active">Active only</SelectItem>
                <SelectItem value="all">All products</SelectItem>
                <SelectItem value="inactive">Inactive only</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>
    </section>
  );
}
