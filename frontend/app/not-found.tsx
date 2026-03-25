import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="font-display text-6xl font-semibold text-gold-500">404</p>
      <h1 className="mt-4 font-display text-2xl text-white">Page not found</h1>
      <p className="mt-2 text-sm text-zinc-500">
        This URL does not exist. If you deployed on Vercel, confirm the project{" "}
        <strong className="text-zinc-400">Root Directory</strong> is set to{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-gold-300">frontend</code>.
      </p>
      <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-8 inline-flex")}>
        Back to home
      </Link>
    </main>
  );
}
