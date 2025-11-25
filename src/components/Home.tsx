import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
// import { type ByteArrayResponse } from "../hooks/useBytesToHex";
// import { useBytesToHex } from "../hooks/useBytesToHex";
import { DepositSignatureData } from "./DepositSignatureData";
import { Box } from "@mui/material";
export const Home = () => {
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
      const response = await fetch(
        "/get_deposit_signature?amount=32&address=0xaa1cd3f5bcd5aeea5f419c6c49a05f9e8abc104b"
      );
      const data = await response.json();
      setDepositSignatureData(data);
    };
    getDepositSignature();
  }, [consensusPublicKeys, nodePublicKeys]);
  console.log(depositSignatureData, "depositSignatureData");
  console.log(consensusPublicKeys, "consensusPublicKeys");
  return (
    <div>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          height: "100dvh",
          width: { xs: "100dvw", sm: "80dvw" },
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            ml: "auto",
            pb: 2,
            pr: 4,
            alignSelf: "flex-end",
            justifySelf: "flex-end",
          }}
        >
          <ConnectButton />
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
