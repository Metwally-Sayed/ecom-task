import Link from "next/link";

import { AppShell } from "@/components/app/app-shell";
import { RegisterForm } from "@/components/auth/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col justify-center gap-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/70">
            New customer
          </p>
          <h1 className="font-heading text-4xl tracking-tight sm:text-5xl">
            Create an account on top of the existing auth backend.
          </h1>
          <p className="max-w-lg text-base leading-8 text-muted-foreground">
            Registration creates the user in Supabase through the Fastify API,
            then signs the customer in immediately.
          </p>
        </section>

        <Card className="rounded-[2rem] border border-border/70 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardDescription>
              Accounts are created as customer users by default.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <RegisterForm />
            <div className="text-sm text-muted-foreground">
              Already registered?{" "}
              <Link href="/login" className="hover:text-foreground">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
