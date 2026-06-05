"use client";

import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/lib/schemas/auth";

export function ForgotPasswordForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = {
      email: String(formData.get("email") ?? ""),
    };

    const parsedPayload = forgotPasswordSchema.safeParse(payload);
    if (!parsedPayload.success) {
      setErrorMessage(parsedPayload.error.issues[0]?.message ?? "Invalid email");
      return;
    }

    setIsPending(true);

    const response = await fetch("/api/auth/forgot-password", {
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
      setErrorMessage(result?.message ?? "Unable to send reset email");
      return;
    }

    setSuccessMessage(result?.message ?? "Password reset email sent");
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      {errorMessage ? (
        <Alert>
          <AlertTitle>Reset request failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {successMessage ? (
        <Alert>
          <AlertTitle>Reset email sent</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="forgot-password-email">Email</FieldLabel>
          <Input
            id="forgot-password-email"
            name="email"
            type="email"
            placeholder="customer@test.com"
          />
        </Field>
      </FieldGroup>

      <Button size="lg" type="submit" disabled={isPending}>
        {isPending ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
