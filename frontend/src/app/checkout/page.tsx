import { redirect } from "next/navigation";

import { AppShell } from "@/components/app/app-shell";
import { CheckoutForm } from "@/components/cart/checkout-form";
import { getSessionProfile } from "@/lib/auth/session";

export default async function CheckoutPage() {
  const profile = await getSessionProfile();

  if (!profile) {
    redirect("/login?next=/checkout");
  }

  return (
    <AppShell>
      <section className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/70">
          Checkout
        </p>
        <h1 className="font-heading text-4xl tracking-tight">
          Confirm the cart and send it to the order API.
        </h1>
        <p className="max-w-2xl text-base leading-8 text-muted-foreground">
          Signed in as {profile.email}. Prices are recalculated by the backend
          when the order is created.
        </p>
      </section>

      <CheckoutForm />
    </AppShell>
  );
}
