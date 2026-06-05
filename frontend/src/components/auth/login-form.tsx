"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { loginSchema } from "@/lib/schemas/auth";

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath = "/account" }: LoginFormProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setErrorMessage(null);

    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const parsedPayload = loginSchema.safeParse(payload);
    if (!parsedPayload.success) {
      setErrorMessage(parsedPayload.error.issues[0]?.message ?? "Invalid form");
      return;
    }

    setIsPending(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedPayload.data),
    });

    const result = (await response.json().catch(() => null)) as
      | { data?: { role?: string }; message?: string }
      | null;

    setIsPending(false);

    if (!response.ok) {
      setErrorMessage(result?.message ?? "Unable to sign in");
      return;
    }

    const destination =
      result?.data?.role === "admin" ? "/admin/products" : nextPath;

    startTransition(() => {
      router.replace(destination);
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      {errorMessage ? (
        <Alert>
          <AlertTitle>Sign in failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="login-email">Email</FieldLabel>
          <Input id="login-email" name="email" type="email" placeholder="customer@test.com" />
        </Field>
        <Field>
          <FieldLabel htmlFor="login-password">Password</FieldLabel>
          <Input
            id="login-password"
            name="password"
            type="password"
            placeholder="Password123!"
          />
        </Field>
      </FieldGroup>

      <Button size="lg" type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
