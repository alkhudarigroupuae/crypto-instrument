"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";

type LoginRes =
  | { requires2fa: true; tempToken: string }
  | { error: string; code?: string };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const data = await apiFetch<LoginRes>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        token: null,
      });
      if ("requires2fa" in data && data.requires2fa && data.tempToken) {
        sessionStorage.setItem("temp2fa", data.tempToken);
        router.push("/verify-2fa");
        return;
      }
      setErr("Unexpected response");
    } catch (e: unknown) {
      const body = (e as { body?: { code?: string; error?: string } }).body;
      if (body?.code === "2FA_SETUP_REQUIRED") {
        setErr("Finish Google Authenticator setup before signing in.");
      } else {
        setErr(e instanceof Error ? e.message : "Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Email, password, then one-time code.</CardDescription>
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
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Password</label>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Continue to 2FA"}
          </Button>
          <p className="text-center text-sm text-zinc-500">
            New here?{" "}
            <Link href="/register" className="text-gold-500 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
