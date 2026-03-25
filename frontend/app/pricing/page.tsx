import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20">
      <h1 className="font-display text-4xl text-white">Pricing</h1>
      <p className="mt-3 max-w-3xl text-zinc-400">
        Clear fintech pricing designed for retail and institutional operators.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { tier: "Starter", price: "$0", note: "2FA auth + dashboard + wallet" },
          { tier: "Pro", price: "$49", note: "Advanced analytics and team controls" },
          { tier: "Prime", price: "Custom", note: "Dedicated risk parameters and support" },
        ].map((p) => (
          <Card key={p.tier} className={p.tier === "Pro" ? "border-gold-500/30" : ""}>
            <CardHeader>
              <CardTitle>{p.tier}</CardTitle>
              <p className="font-display text-3xl text-gold-400">{p.price}</p>
              <CardDescription>{p.note}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>Get started</Link>
      </div>
    </main>
  );
}
