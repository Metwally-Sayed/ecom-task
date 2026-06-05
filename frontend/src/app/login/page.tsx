import Link from "next/link";

import { AppShell } from "@/components/app/app-shell";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const nextPath = getFirstValue(resolvedSearchParams.next) ?? "/account";

  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col justify-center gap-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/70">
            Account access
          </p>
          <h1 className="font-heading text-4xl tracking-tight sm:text-5xl">
            Sign in to place orders and track them.
          </h1>
          <p className="max-w-lg text-base leading-8 text-muted-foreground">
            The frontend keeps tokens in httpOnly cookies, so the browser never
            needs to hold the JWT directly.
          </p>
        </section>

        <Card className="rounded-[2rem] border border-border/70 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Use the seeded customer or admin account from the existing backend.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <LoginForm nextPath={nextPath} />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <Link href="/forgot-password" className="hover:text-foreground">
                Forgot password
              </Link>
              <Link href="/register" className="hover:text-foreground">
                Create account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
