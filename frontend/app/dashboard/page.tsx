"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import {
  apiFetch,
  clearAccessToken,
  getAccessToken,
} from "@/lib/api";
import { Activity, LogOut, PiggyBank, Shield } from "lucide-react";

type Profile = {
  user: {
    email: string;
    emailVerified: boolean;
    totpVerified: boolean;
    createdAt: number;
  };
  balances: { asset: string; amount: number }[];
  positions: {
    _id: string;
    collateralAsset: string;
    collateralAmount: number;
    borrowedAsset: string;
    borrowedAmount: number;
    healthFactor: number;
  }[];
  transactions: {
    _id: string;
    type: string;
    asset: string;
    amount: number;
    ts: number;
  }[];
  audit: { action: string; ts: number; detail?: string }[];
  lending: { asset: string; apy: number; label: string }[];
};

export default function DashboardPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [depositAmt, setDepositAmt] = useState("");
  const [depAsset, setDepAsset] = useState<"ETH" | "USDC" | "WBTC">("USDC");
  const [collat, setCollat] = useState("");
  const [borrow, setBorrow] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!getAccessToken()) router.replace("/login");
  }, [mounted, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiFetch<Profile>("/user/profile"),
    enabled: typeof window !== "undefined" && !!getAccessToken(),
  });

  function signOut() {
    clearAccessToken();
    qc.clear();
    router.push("/");
  }

  async function deposit() {
    const amount = Number(depositAmt);
    if (!Number.isFinite(amount) || amount <= 0) return;
    await apiFetch("/deposit", {
      method: "POST",
      body: JSON.stringify({ asset: depAsset, amount }),
    });
    setDepositAmt("");
    qc.invalidateQueries({ queryKey: ["profile"] });
  }

  async function borrowSubmit() {
    const collateralAmount = Number(collat);
    const borrowAmount = Number(borrow);
    if (
      !Number.isFinite(collateralAmount) ||
      !Number.isFinite(borrowAmount) ||
      collateralAmount <= 0 ||
      borrowAmount <= 0
    )
      return;
    await apiFetch("/borrow", {
      method: "POST",
      body: JSON.stringify({
        collateralAsset: "ETH",
        collateralAmount,
        borrowAmount,
      }),
    });
    setCollat("");
    setBorrow("");
    qc.invalidateQueries({ queryKey: ["profile"] });
  }

  if (!mounted) return <DashboardSkeleton />;
  if (!getAccessToken()) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-zinc-400">
        Redirecting to sign in…
      </div>
    );
  }
  if (isLoading) return <DashboardSkeleton />;
  if (error || !data) {
    return (
      <div className="px-4 py-20 text-center text-red-300">
        Unable to load dashboard.{" "}
        <button type="button" className="underline" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">
            Overview
          </h1>
          <p className="text-sm text-zinc-500">{data.user.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            <Shield className="h-3 w-3 text-gold-500" />
            2FA {data.user.totpVerified ? "on" : "off"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            Email {data.user.emailVerified ? "verified" : "pending"}
          </span>
          <Button variant="outline" size="sm" type="button" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {data.balances.map((b, i) => (
          <motion.div
            key={b.asset}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardHeader>
                <CardDescription>Balance</CardDescription>
                <CardTitle className="text-2xl text-white">
                  {b.amount.toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}{" "}
                  <span className="text-gold-500">{b.asset}</span>
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-gold-500" />
              Lending APY
            </CardTitle>
            <CardDescription>Reference rates (extend with on-chain oracles).</CardDescription>
          </CardHeader>
          <div className="grid gap-3 sm:grid-cols-3">
            {data.lending.map((l) => (
              <div
                key={l.asset}
                className="rounded-xl border border-white/10 bg-black/30 p-4 text-center"
              >
                <p className="text-xs text-zinc-500">{l.label}</p>
                <p className="mt-1 font-display text-xl text-gold-400">
                  {l.apy}%
                </p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                  APY
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Borrow position</CardTitle>
            <CardDescription>Collateralized USDC borrow (simulated).</CardDescription>
          </CardHeader>
          {data.positions.length === 0 ? (
            <p className="text-sm text-zinc-500">No active borrow.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.positions.map((p) => (
                <li
                  key={p._id}
                  className="flex justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                >
                  <span>
                    {p.collateralAmount} {p.collateralAsset} → {p.borrowedAmount}{" "}
                    {p.borrowedAsset}
                  </span>
                  <span className="text-gold-400">
                    HF {p.healthFactor.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deposit (simulated)</CardTitle>
            <CardDescription>Increases internal ledger balance.</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-zinc-500">Asset</label>
              <select
                className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                value={depAsset}
                onChange={(e) =>
                  setDepAsset(e.target.value as typeof depAsset)
                }
              >
                <option value="ETH">ETH</option>
                <option value="USDC">USDC</option>
                <option value="WBTC">WBTC</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-zinc-500">Amount</label>
              <Input
                type="number"
                min={0}
                step="any"
                value={depositAmt}
                onChange={(e) => setDepositAmt(e.target.value)}
              />
            </div>
            <Button type="button" onClick={deposit}>
              Deposit
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Borrow against ETH</CardTitle>
            <CardDescription>Locks ETH collateral, mints USDC to balance.</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                ETH collateral
              </label>
              <Input
                type="number"
                min={0}
                step="any"
                value={collat}
                onChange={(e) => setCollat(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                USDC to borrow
              </label>
              <Input
                type="number"
                min={0}
                step="any"
                value={borrow}
                onChange={(e) => setBorrow(e.target.value)}
              />
            </div>
            <Button type="button" variant="outline" onClick={borrowSubmit}>
              Execute borrow
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-gold-500" />
              Transactions
            </CardTitle>
          </CardHeader>
          <ul className="max-h-64 space-y-2 overflow-auto text-sm">
            {data.transactions.map((t) => (
              <li
                key={t._id}
                className="flex justify-between border-b border-white/5 py-2 text-zinc-300"
              >
                <span>
                  {t.type} · {t.amount} {t.asset}
                </span>
                <span className="text-zinc-600">
                  {new Date(t.ts).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit trail</CardTitle>
            <CardDescription>Recent security-relevant events.</CardDescription>
          </CardHeader>
          <ul className="max-h-64 space-y-2 overflow-auto text-sm">
            {data.audit.map((a, i) => (
              <li
                key={i}
                className="flex justify-between border-b border-white/5 py-2 text-zinc-300"
              >
                <span>{a.action}</span>
                <span className="text-zinc-600">
                  {new Date(a.ts).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
