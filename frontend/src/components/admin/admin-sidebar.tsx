import Link from "next/link";

import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
];

export function AdminSidebar() {
  return (
    <aside className="rounded-[2rem] border border-border/70 bg-card/90 p-4 shadow-sm">
      <p className="px-2 pb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary/70">
        Admin
      </p>
      <nav className="flex flex-col gap-1">
        {adminNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-2xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
