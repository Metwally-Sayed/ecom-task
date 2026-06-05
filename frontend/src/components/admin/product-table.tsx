import Link from "next/link";

import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/currency";

type ProductTableProps = {
  products: Product[];
};

export function ProductTable({ products }: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.category?.name ?? "Uncategorized"}</TableCell>
            <TableCell>
              <Badge variant={product.isActive ? "secondary" : "outline"}>
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>{formatCurrency(product.price)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="text-sm font-medium text-primary"
                >
                  Edit
                </Link>
                <DeleteProductButton id={product.id} name={product.name} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
