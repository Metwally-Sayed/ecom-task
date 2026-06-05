import Link from "next/link";

import { AppShell } from "@/components/app/app-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col justify-center gap-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/70">
            Recovery
          </p>
          <h1 className="font-heading text-4xl tracking-tight sm:text-5xl">
            Request a password reset email.
          </h1>
          <p className="max-w-lg text-base leading-8 text-muted-foreground">
            This forwards directly to the backend password reset endpoint and
            preserves the existing Supabase flow.
          </p>
        </section>

        <Card className="rounded-[2rem] border border-border/70 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Reset password</CardTitle>
            <CardDescription>
              Enter the email address attached to the account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <ForgotPasswordForm />
            <div className="text-sm text-muted-foreground">
              Back to{" "}
              <Link href="/login" className="hover:text-foreground">
                sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
