import type { PropsWithChildren } from "react";
import "./App.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, http, type Config } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";
import { Home } from "./components/Home";
import { sanvil, localSeismicDevnet } from "seismic-react/rainbowkit";
import { CHAIN_ID } from "./hooks/useContract";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import { ShieldedWalletProvider } from "seismic-react";

const SUPPORTED_CHAINS = [sanvil, localSeismicDevnet];
const CHAINS = SUPPORTED_CHAINS.filter((c) => c.id === CHAIN_ID);

const config = getDefaultConfig({
  appName: "Staking UI",
  projectId: "0983a6473d37a95e7d569f091435c383",
  // @ts-expect-error: this is fine
  chains: CHAINS,
  ssr: false,
});

const client = new QueryClient();

const Providers: React.FC<PropsWithChildren<{ config: Config }>> = ({
  config,
  children,
}) => {
  const publicChain = CHAINS[0];
  const rpcUrl = import.meta.env.PROD
    ? 'https://az-8.seismictest.net/rpc'
    : publicChain.rpcUrls.default.http[0];
  const publicTransport = http(rpcUrl);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RainbowKitProvider>
            {" "}
            <ShieldedWalletProvider
              config={config}
              options={{
                publicTransport,
                publicChain,
              }}
            >
              {children}
            </ShieldedWalletProvider>
          </RainbowKitProvider>
        </ThemeProvider>
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
