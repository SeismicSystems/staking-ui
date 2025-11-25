import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useClient } from "../hooks/useClient";
import { DepositSignatureData } from "./DepositSignatureData";
import { Box, Typography, useTheme } from "@mui/material";
import { formatGwei } from "viem";
export const Home = () => {
  const { address } = useAccount();
  const [consensusPublicKeys, setConsensusPublicKeys] = useState<string[]>([]);
  const [nodePublicKeys, setNodePublicKeys] = useState<string[]>([]);
  const [depositSignatureData, setDepositSignatureData] = useState<{
    node_pubkey: number[];
    consensus_pubkey: number[];
    withdrawal_credentials: number[];
    node_signature: number[];
    consensus_signature: number[];
    deposit_data_root: number[];
  } | null>(null);
  const theme = useTheme();
  useEffect(() => {
    const fetchPublicKeys = async () => {
      const response = await fetch("/get_public_keys");
      const data = await response.json();
      setConsensusPublicKeys(data.consensus);
      setNodePublicKeys(data.node);
    };
    fetchPublicKeys();
  }, []);

  useEffect(() => {
    const getDepositSignature = async () => {
      if (!address) return;
      const response = await fetch(
        `/get_deposit_signature?amount=32&address=${address}`
      );
      const data = await response.json();
      setDepositSignatureData(data);
    };
    getDepositSignature();
  }, [consensusPublicKeys, nodePublicKeys, address]);
  const { balanceEthWallet, walletAddress } = useClient();
  const [balance, setBalance] = useState<bigint | null>(null);

  useEffect(() => {
    balanceEthWallet()
      .then((b) => setBalance(b))
      .catch((e) => console.error("Error fetching balance", e));
  }, [balanceEthWallet]);

  return (
    <div>
      <Box
        className="home-container"
        sx={{
          display: "flex",
          height: "100dvh",
          border: "1px solid blue",
          width: { xs: "100dvw", sm: "100dvw", md: "90dvw" },
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="h3" sx={{ mt: 4 }}>
          Seismic Staking
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pb: 2,
            pt: 4,
          }}
        >
          <ConnectButton accountStatus="full" showBalance={true} />
          <Typography
            variant="body2"
            sx={{ color: theme.palette.primary.main, mt: 1 }}
          >
            Balance: {balance ? formatGwei(balance) : "0"} ETH
          </Typography>
        </Box>
        <DepositSignatureData
          isWalletConnected={!!address}
          depositSignatureData={
            depositSignatureData || {
              node_pubkey: [],
              consensus_pubkey: [],
              withdrawal_credentials: [],
              node_signature: [],
              consensus_signature: [],
              deposit_data_root: [],
            }
          }
        />
        <Box sx={{ mt: "auto", mb: 2 }}>
          <img
            src="/seis_logo.png"
            alt="Seismic Logo"
            style={{ height: "50px" }}
          />
        </Box>
      </Box>
    </div>
  );
};
