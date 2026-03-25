"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Building2,
  ChartCandlestick,
  Landmark,
  Lock,
  Shield,
  Sparkles,
  Wallet,
} from "lucide-react";

const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[size:48px_48px] bg-grid-gold opacity-40" aria-hidden />
      <div className="pointer-events-none absolute -left-40 top-32 h-[420px] w-[420px] rounded-full bg-gold-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-[360px] w-[360px] rounded-full bg-amber-500/10 blur-[90px]" />

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-20 md:pt-28">
        <motion.div variants={{ show: { transition: { staggerChildren: 0.08 } } }} initial="initial" animate="show" className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <motion.p variants={fade} className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-gold-500/90">
              Institutional DeFi Platform
            </motion.p>
            <motion.h1 variants={fade} className="font-display text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
              Wealth rails for the next
              <span className="block bg-gradient-to-r from-gold-200 via-gold-500 to-amber-600 bg-clip-text text-transparent">
                trillion on-chain.
              </span>
            </motion.h1>
            <motion.p variants={fade} className="mt-6 max-w-2xl text-lg text-zinc-400">
              SparkFi delivers premium lending and borrowing infrastructure with secure account access,
              wallet-native flows, and real-time portfolio intelligence.
            </motion.p>
            <motion.div variants={fade} className="mt-10 flex flex-wrap gap-4">
              <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
                Launch your account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                Open dashboard
              </Link>
            </motion.div>
          </div>

          <motion.div variants={fade} className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "TVL Simulated", value: "$284M" },
              { label: "Average APY", value: "8.7%" },
              { label: "Active Accounts", value: "42K+" },
              { label: "Loan Health", value: "99.2%" },
            ].map((s) => (
              <Card key={s.label} className="p-4">
                <p className="text-xs uppercase tracking-widest text-zinc-500">{s.label}</p>
                <p className="mt-2 font-display text-2xl text-gold-400">{s.value}</p>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Lock, title: "Encrypted 2FA", desc: "TOTP secrets encrypted with AES-256-GCM and step-up JWT flows." },
            { icon: Wallet, title: "Wallet-native UX", desc: "MetaMask and WalletConnect ready with instant account context." },
            { icon: ChartCandlestick, title: "Yield intelligence", desc: "APY surfaces, position monitoring, and transparent execution data." },
            { icon: Shield, title: "Audit trail", desc: "Security events and sensitive operations tracked by design." },
          ].map((item) => (
            <Card key={item.title} className="group hover:border-gold-500/20">
              <CardHeader>
                <item.icon className="mb-2 h-8 w-8 text-gold-500 transition group-hover:scale-105" />
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-20 lg:grid-cols-3">
        {[
          {
            title: "Earn",
            desc: "Deposit digital assets and capture competitive variable yield with clear risk boundaries.",
            href: "/earn",
            icon: Sparkles,
          },
          {
            title: "Borrow",
            desc: "Use collateralized positions to unlock stable liquidity while preserving market exposure.",
            href: "/borrow",
            icon: Landmark,
          },
          {
            title: "Prime Desk",
            desc: "Institutional controls, multi-role access, and operational reporting for treasury teams.",
            href: "/security",
            icon: Building2,
          },
        ].map((block) => (
          <Card key={block.title} className="flex h-full flex-col justify-between">
            <div>
              <block.icon className="mb-3 h-7 w-7 text-gold-500" />
              <CardTitle>{block.title}</CardTitle>
              <CardDescription>{block.desc}</CardDescription>
            </div>
            <Link href={block.href} className="mt-6 text-sm text-gold-400 hover:text-gold-300">
              Explore {block.title} →
            </Link>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <Card className="border-gold-500/20 bg-gradient-to-r from-gold-900/20 to-transparent">
          <CardHeader>
            <CardTitle className="text-3xl">Built for serious capital.</CardTitle>
            <CardDescription>
              Start with secure onboarding, complete 2FA in under one minute, and access an institutional-grade dashboard.
            </CardDescription>
          </CardHeader>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className={cn(buttonVariants())}>Start now</Link>
            <Link href="/pricing" className={cn(buttonVariants({ variant: "outline" }))}>View plans</Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
