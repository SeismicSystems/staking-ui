import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useClient } from "../hooks/useClient";
import { DepositSignatureData } from "./DepositSignatureData";
import { Box, Typography, useTheme } from "@mui/material";
import { formatEther } from "viem";
import { StakeComponent } from "../components/StakeComponent";
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
        `/get_deposit_signature/32000000000/${address}`
      );
      console.log("response", response);
      const data = await response.json();
      setDepositSignatureData(data);
    };
    getDepositSignature();
  }, [consensusPublicKeys, nodePublicKeys, address]);
  const { balanceEthWallet } = useClient();
  const [balance, setBalance] = useState<bigint | null>(null);

  useEffect(() => {
    if (!address) {
      setBalance(null);
      return;
    }
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
          width: { xs: "100dvw", sm: "100dvw", md: "90dvw" },
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box className="logo-container" sx={{ mb: 2 }}>
          <img
            src="/seis_logo.png"
            alt="Seismic Logo"
            style={{ height: "50px" }}
          />
        </Box>
        <Box
          className="glass"
          sx={{
            p: 4,
            width: { xs: "90%", sm: "90%", md: "50%", xl: "40%" },
            maxWidth: "804px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Box
            className="connect-button-container"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pb: 2,
              pt: 2,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 5,
              width: "50%",
            }}
          >
            <ConnectButton accountStatus="full" showBalance={false} />
            <Typography
              variant="body2"
              sx={{ color: theme.palette.primary.main, mt: 1 }}
            >
              Balance:{" "}
              {balance ? Number(formatEther(balance)).toFixed(4) : "0.0000"} ETH
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
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
            <StakeComponent
              depositSignatureData={depositSignatureData}
              balance={balance}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
};
