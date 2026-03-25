"use client";

import { Card } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-6 px-4 py-10">
      <div className="h-8 w-48 rounded-lg bg-white/10" />
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-28 bg-white/5" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="h-64 bg-white/5" />
        <Card className="h-64 bg-white/5" />
      </div>
    </div>
  );
}
