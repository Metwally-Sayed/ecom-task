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
import type { Category } from "@/lib/types";

type AdminProductFiltersProps = {
  categories: Category[];
  initialSearch?: string;
  initialCategory?: string;
  initialStatus?: string;
};

export function AdminProductFilters({
  categories,
  initialSearch = "",
  initialCategory,
  initialStatus = "all",
}: AdminProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const deferredSearch = useDeferredValue(search);

  const baseQuery = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  const replaceFilters = useCallback(
    (next: { search?: string; category?: string; status?: string }) => {
      const params = new URLSearchParams(baseQuery.toString());

      if (next.search) {
        params.set("search", next.search);
      } else {
        params.delete("search");
      }

      if (next.category && next.category !== "all") {
        params.set("category", next.category);
      } else {
        params.delete("category");
      }

      if (next.status && next.status !== "all") {
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
    if (currentSearch === nextSearch) return;

    replaceFilters({
      search: nextSearch,
      category: initialCategory,
      status: initialStatus,
    });
  }, [deferredSearch, initialCategory, initialStatus, replaceFilters, searchParams]);

  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_10rem]">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="admin-product-search">Search</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>
                <SearchIcon />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="admin-product-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name"
            />
          </InputGroup>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="admin-category-filter">Category</FieldLabel>
          <Select
            value={initialCategory ?? "all"}
            onValueChange={(value) =>
              replaceFilters({
                search: deferredSearch.trim(),
                category: value ?? undefined,
                status: initialStatus,
              })
            }
          >
            <SelectTrigger id="admin-category-filter" className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="admin-status-filter">Status</FieldLabel>
          <Select
            value={initialStatus}
            onValueChange={(value) =>
              replaceFilters({
                search: deferredSearch.trim(),
                category: initialCategory ?? undefined,
                status: value ?? undefined,
              })
            }
          >
            <SelectTrigger id="admin-status-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>
    </div>
  );
}
