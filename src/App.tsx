import type { PropsWithChildren } from "react";
import "./App.css";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ConnectButton, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, http, type Config } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";
import { mainnet } from "wagmi/chains";
import { Home } from "./components/Home";
// import { sanvil, seismicDevnet2 } from "seismic-react/rainbowkit";

// const SUPPORTED_CHAINS = [sanvil, seismicDevnet2];
// const CHAINS = SUPPORTED_CHAINS.filter((c) => c.id === CHAIN_ID);

const config = getDefaultConfig({
  appName: "Staking UI",
  projectId: "0983a6473d37a95e7d569f091435c383",
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const client = new QueryClient();

const Providers: React.FC<PropsWithChildren<{ config: Config }>> = ({
  config,
  children,
}) => {
  // const publicChain = CHAINS[0];
  // const publicTransport = http(publicChain.rpcUrls.default.http[0]);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

function App() {
  return (
    <>
      <Providers config={config}>
        <Home />
      </Providers>
    </>
  );
}

export default App;
