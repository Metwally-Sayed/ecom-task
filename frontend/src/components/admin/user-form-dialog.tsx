"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { clientFetch } from "@/lib/client-fetch";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Profile } from "@/lib/types";

type UserFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: Profile;
};

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const router = useRouter();
  const isEdit = !!user;
  const [isPending, setIsPending] = useState(false);
  const [role, setRole] = useState(user?.role ?? "customer");
  const [status, setStatus] = useState(user?.status ?? "active");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role,
    };
    if (!isEdit) {
      payload.password = formData.get("password") as string;
    } else {
      payload.status = status;
    }

    setIsPending(true);
    try {
      const url = isEdit ? `/api/admin/users/${user.id}` : "/api/admin/users";
      const method = isEdit ? "PATCH" : "POST";
      const res = await clientFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(result?.message ?? "Something went wrong");
        return;
      }
      toast.success(isEdit ? "User updated" : "User created");
      onOpenChange(false);
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit user" : "Add user"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="uf-name">Name</FieldLabel>
              <Input id="uf-name" name="name" defaultValue={user?.name} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="uf-email">Email</FieldLabel>
              <Input id="uf-email" name="email" type="email" defaultValue={user?.email} required />
            </Field>
            {!isEdit && (
              <Field>
                <FieldLabel htmlFor="uf-password">Password</FieldLabel>
                <Input id="uf-password" name="password" type="password" minLength={8} required />
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="uf-role">Role</FieldLabel>
              <Select value={role} onValueChange={(v) => v && setRole(v)}>
                <SelectTrigger id="uf-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            {isEdit && (
              <Field>
                <FieldLabel htmlFor="uf-status">Status</FieldLabel>
                <Select value={status} onValueChange={(v) => v && setStatus(v)}>
                  <SelectTrigger id="uf-status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="deactivated">Deactivated</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          </FieldGroup>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEdit ? "Save changes" : "Create user"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
