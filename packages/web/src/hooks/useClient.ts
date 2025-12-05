import { useCallback, useEffect, useState } from "react";
import type { Hex } from "viem";
import { useShieldedWallet } from "seismic-react";

export const useClient = () => {
  const [loaded, setLoaded] = useState(false);

  const [walletAddress, setWalletAddress] = useState<Hex | null>(null);
  const { walletClient, publicClient } = useShieldedWallet();

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !walletClient || !walletClient.account) {
      return;
    }

    setWalletAddress(walletClient.account.address);
  }, [loaded, walletClient]);

  const balanceEthWallet = useCallback(async (): Promise<bigint> => {
    if (!publicClient || !walletAddress) {
      return BigInt(0);
    }

    return await publicClient.getBalance({
      address: walletAddress,
    });
  }, [publicClient, walletAddress]);

  return {
    walletAddress,
    balanceEthWallet,
  };
};
