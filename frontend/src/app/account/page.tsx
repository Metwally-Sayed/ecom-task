import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboardIcon, PackageIcon, ShoppingCartIcon } from "lucide-react";

import { AppShell } from "@/components/app/app-shell";
import { AccountActions } from "@/components/account/account-actions";
import { EditProfileForm } from "@/components/account/edit-profile-form";
import { getSessionProfile, getAccessToken } from "@/lib/auth/session";
import { getMyOrders } from "@/lib/backend/orders";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";

const adminLinks = [
  {
    href: "/admin/products",
    icon: PackageIcon,
    label: "Manage Products",
    description: "Add, edit, and deactivate products",
  },
  {
    href: "/admin/orders",
    icon: ShoppingCartIcon,
    label: "Manage Orders",
    description: "View and update order statuses",
  },
  {
    href: "/admin/users",
    icon: LayoutDashboardIcon,
    label: "Manage Users",
    description: "Add, edit, block, and delete users",
  },
];

export default async function AccountPage() {
  const profile = await getSessionProfile();
  const accessToken = await getAccessToken();

  if (!profile || !accessToken) {
    redirect("/login?next=/account");
  }

  const isAdmin = profile.role === "admin";
  const orders = isAdmin ? null : await getMyOrders(accessToken, 1, 10);

  return (
    <AppShell>
      <section className="flex flex-col gap-6">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <Card className="rounded-[2rem] border border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <EditProfileForm profile={profile} />
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <Badge variant="secondary" className="mt-1">{profile.role}</Badge>
              </div>
            </CardContent>
          </Card>

          {isAdmin ? (
            <Card className="rounded-[2rem] border border-border/70 bg-card/90 shadow-sm">
              <CardHeader>
                <CardTitle>Quick access</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {adminLinks.map(({ href, icon: Icon, label, description }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-auto justify-start gap-4 rounded-2xl px-4 py-3",
                    )}
                  >
                    <Icon className="size-5 shrink-0 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-[2rem] border border-border/70 bg-card/90 shadow-sm">
              <CardHeader>
                <CardTitle>Recent orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders?.data.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No orders yet. Place the first one from the checkout page.
                  </p>
                ) : (
                  <div className="flex flex-col">
                    {orders?.data.map((order, index) => (
                      <div key={order.id}>
                        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {order.items.map((item) => (
                                <Badge key={item.id} variant="outline">
                                  {item.productName ?? "Removed product"} x{item.quantity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col items-start gap-2 sm:items-end">
                            <Badge variant="secondary">{order.status}</Badge>
                            <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                          </div>
                        </div>
                        {index < (orders?.data.length ?? 0) - 1 ? <Separator /> : null}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="rounded-[2rem] border border-border/70 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Account actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Deactivating your account will log you out and prevent future logins until support reactivates it.
              Deleting your account is permanent and cannot be undone.
            </p>
            <AccountActions />
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
