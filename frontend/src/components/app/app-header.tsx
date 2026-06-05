import Link from "next/link";

import { LogoutButton } from "@/components/app/logout-button";
import { buttonVariants } from "@/components/ui/button";
import { getSessionProfile } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

export async function AppHeader() {
  const profile = await getSessionProfile();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/products" className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            MS
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="font-heading text-sm font-semibold tracking-[0.16em] uppercase">
              Mini Shop
            </span>
            <span className="truncate text-sm text-muted-foreground">
              Next.js storefront on the existing Fastify backend
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href="/products"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Products
          </Link>

          {profile ? (
            <>
              {profile.role === "admin" && (
                <Link
                  href="/admin"
                  className={cn(buttonVariants({ variant: "ghost" }))}
                >
                  Admin
                </Link>
              )}
              <Link
                href="/account"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                Account
              </Link>
              <span className="px-2 text-sm text-muted-foreground">
                {profile.name}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
