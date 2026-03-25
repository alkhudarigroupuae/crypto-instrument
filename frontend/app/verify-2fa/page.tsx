"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch, setAccessToken } from "@/lib/api";

export default function Verify2FaPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const tempToken =
      typeof window !== "undefined" ? sessionStorage.getItem("temp2fa") : null;
    if (!tempToken) {
      setErr("Session expired — start login again.");
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch<{ accessToken: string }>("/auth/verify-2fa", {
        method: "POST",
        body: JSON.stringify({ tempToken, token }),
        token: null,
      });
      sessionStorage.removeItem("temp2fa");
      setAccessToken(data.accessToken);
      router.push("/dashboard");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Two-factor authentication</CardTitle>
          <CardDescription>Enter the code from Google Authenticator.</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {err && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {err}
            </p>
          )}
          <div>
            <label className="mb-1 block text-xs text-zinc-500">OTP</label>
            <Input
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
              required
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying…" : "Complete sign in"}
          </Button>
          <p className="text-center text-sm text-zinc-500">
            <Link href="/login" className="text-gold-500 hover:underline">
              Start over
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
