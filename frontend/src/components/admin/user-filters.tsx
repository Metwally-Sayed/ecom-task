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

type UserFiltersProps = {
  initialSearch?: string;
  initialRole?: string;
  initialStatus?: string;
};

export function UserFilters({
  initialSearch = "",
  initialRole = "all",
  initialStatus = "all",
}: UserFiltersProps) {
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
    (next: { search?: string; role?: string; status?: string }) => {
      const params = new URLSearchParams(baseQuery.toString());

      if (next.search) params.set("search", next.search);
      else params.delete("search");

      if (next.role && next.role !== "all") params.set("role", next.role);
      else params.delete("role");

      if (next.status && next.status !== "all") params.set("status", next.status);
      else params.delete("status");

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
    replaceFilters({ search: nextSearch, role: initialRole, status: initialStatus });
  }, [deferredSearch, initialRole, initialStatus, replaceFilters, searchParams]);

  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_10rem_12rem]">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="user-search">Search</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText><SearchIcon /></InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="user-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
            />
          </InputGroup>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="user-role-filter">Role</FieldLabel>
          <Select
            value={initialRole}
            onValueChange={(value) =>
              replaceFilters({ search: deferredSearch.trim(), role: value ?? undefined, status: initialStatus })
            }
          >
            <SelectTrigger id="user-role-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="user-status-filter">Status</FieldLabel>
          <Select
            value={initialStatus}
            onValueChange={(value) =>
              replaceFilters({ search: deferredSearch.trim(), role: initialRole, status: value ?? undefined })
            }
          >
            <SelectTrigger id="user-status-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="deactivated">Deactivated</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>
    </div>
  );
}
