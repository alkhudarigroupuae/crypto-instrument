import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export default function BorrowPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20">
      <h1 className="font-display text-4xl text-white">Borrow</h1>
      <p className="mt-3 max-w-3xl text-zinc-400">
        Open collateralized credit lines with dynamic health factor monitoring and policy-driven limits.
      </p>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Collateral Framework</CardTitle>
            <CardDescription>Use ETH/WBTC as collateral with conservative LTV defaults.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stable Liquidity</CardTitle>
            <CardDescription>Borrow USDC with transparent fees and liquidation thresholds.</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="mt-8">
        <Link href="/dashboard" className={cn(buttonVariants())}>Manage borrow positions</Link>
      </div>
    </main>
  );
}
