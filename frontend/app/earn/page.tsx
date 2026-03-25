import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function EarnPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20">
      <h1 className="font-display text-4xl text-white">Earn</h1>
      <p className="mt-3 max-w-3xl text-zinc-400">
        Deposit assets into curated pools and monitor projected APY with transparent risk parameters.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { asset: "USDC", apy: "8.7%", risk: "Low" },
          { asset: "ETH", apy: "4.2%", risk: "Medium" },
          { asset: "WBTC", apy: "3.1%", risk: "Medium" },
        ].map((r) => (
          <Card key={r.asset}>
            <CardHeader>
              <CardTitle>{r.asset}</CardTitle>
              <CardDescription>Projected APY {r.apy}</CardDescription>
              <p className="text-xs text-zinc-500">Risk band: {r.risk}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/dashboard" className={cn(buttonVariants())}>Go to live dashboard</Link>
      </div>
    </main>
  );
}
