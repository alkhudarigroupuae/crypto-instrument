"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export default function Error({
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
    <main className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-2xl text-white">Something went wrong</h1>
      <p className="mt-2 text-sm text-zinc-500">{error.message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" className={cn(buttonVariants())} onClick={() => reset()}>
          Try again
        </button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Home
        </Link>
      </div>
    </main>
  );
}
