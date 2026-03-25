import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SecurityPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20">
      <h1 className="font-display text-4xl text-white">Security</h1>
      <p className="mt-3 max-w-3xl text-zinc-400">
        Defense-in-depth architecture with encrypted credentials, 2FA enforcement, and auditable controls.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          ["Authentication", "Email/password + TOTP step-up with short-lived challenge tokens."],
          ["Secrets", "TOTP seeds encrypted at rest using AES-256-GCM."],
          ["Data Access", "Backend-only Convex access using shared secret boundary."],
          ["Abuse Protection", "Rate limiting and strict input validation on critical routes."],
          ["Auditability", "High-value actions are persisted in immutable event trails."],
          ["Transport", "Designed for HTTPS-only deployment across Vercel/Render/Convex."],
        ].map(([title, desc]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}
