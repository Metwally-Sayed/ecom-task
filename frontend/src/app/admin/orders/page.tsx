import { OrderTable } from "@/components/admin/order-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAccessToken } from "@/lib/auth/session";
import { getAllOrders } from "@/lib/backend/orders";

export default async function AdminOrdersPage() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return null;
  }

  const orders = await getAllOrders(accessToken, { page: 1, limit: 100 });

  return (
    <Card className="rounded-[2rem] border border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <OrderTable orders={orders.data} />
      </CardContent>
    </Card>
  );
}
