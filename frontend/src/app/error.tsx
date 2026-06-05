"use client";

import { useEffect } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4">
      <Alert className="max-w-xl">
        <AlertTitle>Unable to load the page</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col gap-4">
          <p>
            The storefront hit an unexpected error while loading data from the
            backend.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={reset}>Try again</Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
