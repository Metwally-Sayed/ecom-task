import { redirect } from "next/navigation";

import { AppShell } from "@/components/app/app-shell";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdminProfile } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAdminProfile();

  if (!profile) {
    redirect("/products");
  }

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <AdminSidebar />
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </AppShell>
  );
}
