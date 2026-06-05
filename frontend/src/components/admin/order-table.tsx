import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/currency";

type OrderTableProps = {
  orders: Order[];
};

export function OrderTable({ orders }: OrderTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.user?.email ?? "Unknown"}</TableCell>
            <TableCell>
              <Badge variant="secondary">{order.status}</Badge>
            </TableCell>
            <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
            <TableCell>
              <Link
                href={`/admin/orders/${order.id}`}
                className="text-sm font-medium text-primary"
              >
                View
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
