import { redirect } from "next/navigation";

import { AddUserButton } from "@/components/admin/add-user-button";
import { UserFilters } from "@/components/admin/user-filters";
import { UserTable } from "@/components/admin/user-table";
import { PaginationControls } from "@/components/app/pagination-controls";
import { getUsers } from "@/lib/backend/users";
import { requireAdminProfile, getAccessToken } from "@/lib/auth/session";

const LIMIT = 10;

type AdminUsersPageProps = {
  searchParams: Promise<{
    search?: string;
    role?: string;
    status?: string;
    page?: string;
  }>;
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const profile = await requireAdminProfile();
  const accessToken = await getAccessToken();

  if (!profile || !accessToken) redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const users = await getUsers(
    {
      search: params.search,
      role: params.role,
      status: params.status,
      page,
      limit: LIMIT,
    },
    accessToken,
  );

  const meta = "totalPages" in users.meta ? users.meta : null;

  return (
    <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, roles, and access.
          </p>
        </div>
        <AddUserButton />
      </div>

      <div className="mb-4">
        <UserFilters
          initialSearch={params.search}
          initialRole={params.role ?? "all"}
          initialStatus={params.status ?? "all"}
        />
      </div>

      {meta && (
        <p className="mb-2 text-sm text-muted-foreground">
          {meta.total} user{meta.total !== 1 ? "s" : ""}
        </p>
      )}

      <UserTable users={users.data} currentUserId={profile.id} />

      {meta && (
        <div className="mt-4">
          <PaginationControls
            basePath="/admin/users"
            page={meta.page}
            totalPages={meta.totalPages}
            search={params.search}
            status={params.status}
          />
        </div>
      )}
    </section>
  );
}
