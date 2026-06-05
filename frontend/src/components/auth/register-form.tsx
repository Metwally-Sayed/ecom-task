"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/lib/schemas/auth";

export function RegisterForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setErrorMessage(null);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const parsedPayload = registerSchema.safeParse(payload);
    if (!parsedPayload.success) {
      setErrorMessage(
        parsedPayload.error.issues[0]?.message ?? "Invalid registration form",
      );
      return;
    }

    setIsPending(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedPayload.data),
    });

    const result = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    setIsPending(false);

    if (!response.ok) {
      setErrorMessage(result?.message ?? "Unable to create account");
      return;
    }

    startTransition(() => {
      router.replace("/account");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      {errorMessage ? (
        <Alert>
          <AlertTitle>Registration failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="register-name">Name</FieldLabel>
          <Input id="register-name" name="name" placeholder="Customer name" />
        </Field>
        <Field>
          <FieldLabel htmlFor="register-email">Email</FieldLabel>
          <Input
            id="register-email"
            name="email"
            type="email"
            placeholder="customer@example.com"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="register-password">Password</FieldLabel>
          <Input
            id="register-password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
          />
        </Field>
      </FieldGroup>

      <Button size="lg" type="submit" disabled={isPending}>
        {isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
