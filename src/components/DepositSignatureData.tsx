import React, { useMemo } from "react";
import { Box, Typography, useTheme } from "@mui/material";

interface DepositSignatureDataProps {
  depositSignatureData: {
    node_pubkey: number[];
    consensus_pubkey: number[];
    withdrawal_credentials: number[];
    node_signature: number[];
    consensus_signature: number[];
    deposit_data_root: number[];
  };
}
export const DepositSignatureData = ({
  depositSignatureData,
}: DepositSignatureDataProps) => {
  console.log(depositSignatureData, "depositSignatureData from dsd component");
  const hexResponse = useMemo(() => {
    return {
      node_pubkey: depositSignatureData.node_pubkey
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(""),
      consensus_pubkey: depositSignatureData.consensus_pubkey
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(""),
      withdrawal_credentials: depositSignatureData.withdrawal_credentials
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(""),
      node_signature: depositSignatureData.node_signature
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(""),
      consensus_signature: depositSignatureData.consensus_signature
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(""),
      deposit_data_root: depositSignatureData.deposit_data_root
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(""),
    };
  }, [depositSignatureData]);
  const theme = useTheme();
  return (
    <>
      <Box
        className="deposit-signature-data"
        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 5,
            }}
          >
            <Typography>Node Public Key</Typography>
            <Typography>{hexResponse.node_pubkey}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 5,
            }}
          >
            <Typography>Consensus Public Key</Typography>
            <Typography>{hexResponse.consensus_pubkey}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 5,
            }}
          >
            <Typography>Withdrawal Credentials</Typography>
            <Typography>{hexResponse.withdrawal_credentials}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 5,
            }}
          >
            <Typography>Node Signature</Typography>
            <Typography>{hexResponse.node_signature}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 5,
            }}
          >
            <Typography>Consensus Signature</Typography>
            <Typography>{hexResponse.consensus_signature}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 5,
            }}
          >
            <Typography>Deposit Data Root</Typography>
            <Typography>{hexResponse.deposit_data_root}</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};
