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
import { sanvil, seismicDevnet2 } from "seismic-react/rainbowkit";
import { CHAIN_ID } from "./hooks/useContract";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import { ShieldedWalletProvider } from "seismic-react";

const SUPPORTED_CHAINS = [sanvil, seismicDevnet2];
const CHAINS = SUPPORTED_CHAINS.filter((c) => c.id === CHAIN_ID);

const config = getDefaultConfig({
  appName: "Staking UI",
  projectId: import.meta.env.VITE_PROJECT_ID,
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
  const publicTransport = http(publicChain.rpcUrls.default.http[0]);
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
