"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { clientFetch } from "@/lib/client-fetch";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteUserDialog } from "@/components/admin/delete-user-dialog";
import { UserFormDialog } from "@/components/admin/user-form-dialog";
import type { Profile, UserStatus } from "@/lib/types";

const statusBadgeVariant: Record<UserStatus, "secondary" | "outline" | "destructive"> = {
  active: "secondary",
  deactivated: "outline",
  blocked: "destructive",
};

type UserTableProps = {
  users: Profile[];
  currentUserId: string;
};

export function UserTable({ users, currentUserId }: UserTableProps) {
  const router = useRouter();
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const [deleteUser, setDeleteUser] = useState<Profile | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function updateStatus(user: Profile, status: UserStatus) {
    setPendingId(user.id);
    try {
      const res = await clientFetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(result?.message ?? "Failed to update user");
        return;
      }
      toast.success(
        status === "active" ? "User reactivated" :
        status === "blocked" ? "User blocked" : "User deactivated"
      );
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            const isPending = pendingId === user.id;
            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant[user.status]}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 flex-wrap">
                    <Button variant="ghost" size="sm" onClick={() => setEditUser(user)}>
                      Edit
                    </Button>
                    {!isSelf && (
                      <>
                        {user.status === "blocked" ? (
                          <Button variant="ghost" size="sm" disabled={isPending} onClick={() => updateStatus(user, "active")}>
                            Unblock
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" disabled={isPending} onClick={() => updateStatus(user, "blocked")}>
                            Block
                          </Button>
                        )}
                        {user.status === "deactivated" ? (
                          <Button variant="ghost" size="sm" disabled={isPending} onClick={() => updateStatus(user, "active")}>
                            Reactivate
                          </Button>
                        ) : user.status !== "blocked" ? (
                          <Button variant="ghost" size="sm" disabled={isPending} onClick={() => updateStatus(user, "deactivated")}>
                            Deactivate
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteUser(user)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {editUser && (
        <UserFormDialog
          open={!!editUser}
          onOpenChange={(open) => !open && setEditUser(null)}
          user={editUser}
        />
      )}
      {deleteUser && (
        <DeleteUserDialog
          open={!!deleteUser}
          onOpenChange={(open) => !open && setDeleteUser(null)}
          user={deleteUser}
        />
      )}
    </>
  );
}
