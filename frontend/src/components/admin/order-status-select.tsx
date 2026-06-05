"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "@/lib/types";

type OrderStatusSelectProps = {
  orderId: string;
  status: OrderStatus;
};

const statuses: OrderStatus[] = [
  "Pending",
  "Processing",
  "Completed",
  "Cancelled",
];

export function OrderStatusSelect({
  orderId,
  status,
}: OrderStatusSelectProps) {
  const router = useRouter();
  const [value, setValue] = useState<OrderStatus>(status);

  async function handleStatusChange(nextStatus: string | null) {
    if (!nextStatus || nextStatus === value) {
      return;
    }

    setValue(nextStatus as OrderStatus);

    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!response.ok) {
      setValue(status);
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <Select value={value} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-full min-w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {statuses.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
