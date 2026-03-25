"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-500 backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
