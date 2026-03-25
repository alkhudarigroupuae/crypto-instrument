"use client";

import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectors, connect, isPending } = useConnect();
  const { data: bal } = useBalance({ address });

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden rounded-lg border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs text-gold-200 lg:inline">
          {bal
            ? `${Number(bal.formatted).toFixed(4)} ${bal.symbol}`
            : "—"}{" "}
          · {shortAddr(address)}
        </span>
        <Button variant="outline" size="sm" type="button" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    );
  }

  const injected = connectors[0];
  return (
    <Button
      variant="outline"
      size="sm"
      type="button"
      disabled={isPending || !injected}
      onClick={() => injected && connect({ connector: injected })}
    >
      {isPending ? "Connecting…" : "Connect wallet"}
    </Button>
  );
}
