"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";

type RegOk = {
  email: string;
  qrDataUrl: string;
  manualKey: string;
  verifyEmailUrl: string;
};

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<RegOk | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const data = await apiFetch<RegOk>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        token: null,
      });
      setDone(data);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Scan with Google Authenticator</CardTitle>
              <CardDescription>
                Complete setup by verifying a 6-digit code on the next step.
              </CardDescription>
            </CardHeader>
            <div className="flex flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={done.qrDataUrl}
                alt="QR"
                className="rounded-xl border border-white/10 bg-white p-2"
              />
              <p className="text-center font-mono text-xs text-zinc-400 break-all">
                {done.manualKey}
              </p>
              <Link
                href={`/verify-registration?email=${encodeURIComponent(done.email)}`}
                className={cn(buttonVariants(), "w-full text-center")}
              >
                I&apos;ve added the account — verify OTP
              </Link>
              <p className="text-center text-xs text-zinc-500">
                Optional:{" "}
                <a href={done.verifyEmailUrl} className="text-gold-500 hover:underline">
                  verify email
                </a>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Password + TOTP. No shortcuts on security.</CardDescription>
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={10}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating…" : "Continue"}
          </Button>
          <p className="text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-gold-500 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
