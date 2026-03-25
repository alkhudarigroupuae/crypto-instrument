"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

function Inner() {
  const sp = useSearchParams();
  const token = sp.get("token");
  const [msg, setMsg] = useState("Verifying…");
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setOk(false);
      setMsg("Missing token");
      return;
    }
    (async () => {
      try {
        await apiFetch(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
          token: null,
        });
        setOk(true);
        setMsg("Email verified.");
      } catch {
        setOk(false);
        setMsg("Invalid or expired link.");
      }
    })();
  }, [token]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email verification</CardTitle>
        <CardDescription>{msg}</CardDescription>
      </CardHeader>
      <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}>
        Continue
      </Link>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <Suspense fallback={<p className="text-zinc-500">Loading…</p>}>
        <Inner />
      </Suspense>
    </div>
  );
}
