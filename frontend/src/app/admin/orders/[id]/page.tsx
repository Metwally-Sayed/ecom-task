import { notFound } from "next/navigation";

import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAccessToken } from "@/lib/auth/session";
import { getAllOrders } from "@/lib/backend/orders";
import { formatCurrency } from "@/lib/utils/currency";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const accessToken = await getAccessToken();
  const { id } = await params;

  if (!accessToken) {
    return null;
  }

  const orders = await getAllOrders(accessToken, { page: 1, limit: 100 });
  const order = orders.data.find((item) => item.id === id);

  if (!order) {
    notFound();
  }

  return (
    <Card className="rounded-[2rem] border border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <CardTitle>Order detail</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">{order.id}</p>
        </div>
        <div className="w-full max-w-48">
          <OrderStatusSelect orderId={order.id} status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-3">
          <Badge variant="secondary">{order.status}</Badge>
          <Badge variant="outline">{order.user?.email ?? "Unknown user"}</Badge>
          <Badge variant="outline">{formatCurrency(order.totalAmount)}</Badge>
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-2xl bg-muted/40 p-4"
            >
              <div>
                <p className="font-medium">{item.productName ?? "Removed product"}</p>
                <p className="text-sm text-muted-foreground">
                  Qty {item.quantity} x {formatCurrency(item.unitPrice)}
                </p>
              </div>
              <p className="font-medium">{formatCurrency(item.lineTotal)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
