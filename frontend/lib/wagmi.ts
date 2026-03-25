import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "viem/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const connectors = [injected()];
if (projectId) {
  connectors.push(
    walletConnect({
      projectId,
      showQrModal: true,
    })
  );
}

export const wagmiConfig = createConfig({
  chains: [sepolia, mainnet],
  connectors,
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
});
