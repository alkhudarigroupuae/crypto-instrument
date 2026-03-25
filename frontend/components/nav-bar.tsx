"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { buttonVariants } from "@/components/ui/button";
import { getAccessToken } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const links = [
  { href: "/earn", label: "Earn" },
  { href: "/borrow", label: "Borrow" },
  { href: "/security", label: "Security" },
  { href: "/pricing", label: "Pricing" },
];

export function NavBar() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    setAuthed(!!getAccessToken());
  }, []);

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-ink/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-display text-xl tracking-tight text-white">
          Spark<span className="text-gold-500">Fi</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline">
            Dashboard
          </Link>
          {authed ? (
            <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Open App
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm text-zinc-400 transition hover:text-white md:inline">
                Sign in
              </Link>
              <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
                Get started
              </Link>
            </>
          )}
          <WalletConnectButton />
        </div>
      </div>
    </motion.header>
  );
}
