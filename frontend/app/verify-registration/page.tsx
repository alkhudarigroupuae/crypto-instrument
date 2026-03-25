"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";

function Form() {
  const sp = useSearchParams();
  const initial = sp.get("email") ?? "";
  const [email, setEmail] = useState(initial);
  const [token, setToken] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await apiFetch("/auth/verify-registration", {
        method: "POST",
        body: JSON.stringify({ email, token }),
        token: null,
      });
      setOk(true);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  if (ok) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>2FA enabled</CardTitle>
          <CardDescription>You can sign in from the login page.</CardDescription>
        </CardHeader>
        <Link href="/login" className={cn(buttonVariants(), "flex w-full justify-center")}>
          Go to login
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Confirm authenticator</CardTitle>
        <CardDescription>Enter the 6-digit code from your app.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        {err && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {err}
          </p>
        )}
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-zinc-500">OTP</label>
          <Input
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying…" : "Verify & enable 2FA"}
        </Button>
      </form>
    </Card>
  );
}

export default function VerifyRegistrationPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <Suspense fallback={<div className="text-zinc-500">Loading…</div>}>
        <Form />
      </Suspense>
    </div>
  );
}
