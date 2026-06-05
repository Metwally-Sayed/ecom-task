"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserFormDialog } from "@/components/admin/user-form-dialog";

export function AddUserButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Add user</Button>
      <UserFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
