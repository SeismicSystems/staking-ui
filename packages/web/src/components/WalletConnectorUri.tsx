import { type Connector, useConnect } from "wagmi";

export function WalletConnectUri() {
  const { connect, connectors } = useConnect();

  // Get WalletConnect connector
  const walletConnectConnector = connectors.find(
    ({ id }) => id === "walletConnect",
  );

  const listenForWalletConnectUri = async (
    walletConnectConnector: Connector,
  ) => {
    const provider = await walletConnectConnector.getProvider();

    // @ts-expect-error
    provider.once("display_uri", (uri) => {
      console.log("WalletConnect URI:", uri);
    });
  };

  return (
    <button
      onClick={() => {
        if (!walletConnectConnector) {
          throw new Error("WalletConnect connector not found");
        }
        listenForWalletConnectUri(walletConnectConnector);
        connect({ connector: walletConnectConnector });
      }}
    >
      Get WalletConnect URI
    </button>
  );
}
