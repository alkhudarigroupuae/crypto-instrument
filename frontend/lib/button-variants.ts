import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-gold-600 to-gold-500 text-black shadow-glow hover:brightness-110",
        outline:
          "border border-white/15 bg-white/5 text-zinc-100 backdrop-blur hover:bg-white/10",
        ghost: "text-zinc-300 hover:bg-white/5 hover:text-white",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
