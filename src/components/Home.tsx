import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { DepositSignatureData } from "./DepositSignatureData";
import { Box, Typography } from "@mui/material";
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
  console.log(depositSignatureData, "depositSignatureData");
  console.log(consensusPublicKeys, "consensusPublicKeys");
  console.log(address, "address");
  return (
    <div>
      <Box
        className="home-container"
        sx={{
          display: "flex",
          height: "100dvh",
          border: "1px solid blue",
          width: { xs: "100dvw", sm: "80dvw" },
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h3" sx={{ mt: 4 }}>
          Seismic Staking
        </Typography>
        <Box
          sx={{
            ml: "auto",
            pb: 2,
            pr: 4,
            pt: 4,
            alignSelf: "flex-end",
            justifySelf: "flex-end",
          }}
        >
          <ConnectButton accountStatus="full" showBalance={true} />
        </Box>
        <DepositSignatureData
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
      </Box>
    </div>
  );
};
