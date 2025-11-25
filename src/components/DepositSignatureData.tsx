import { useMemo } from "react";
import { Box, Typography, useTheme, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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

const DataRow = ({ label, value }: { label: string; value: string }) => {
  const theme = useTheme();

  const displayValue =
    value.length > 10 ? `${value.substring(0, 10)}...` : value;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 1,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 5,
        width: "100%",
        padding: 2, // Added a little padding to make it look better with background
      }}
    >
      <Typography
        sx={{
          whiteSpace: "nowrap",
          fontWeight: "bold",
          fontSize: { xs: "1rem", sm: "1rem" },
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          sx={{
            color: theme.palette.primary.main,
            fontSize: { xs: ".9rem", sm: "1rem" },
          }}
        >
          {displayValue}
        </Typography>
        <Tooltip sx={{}} title="Copy to clipboard">
          <IconButton onClick={handleCopy} size="small">
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

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

  return (
    <>
      <Box
        className="deposit-signature-data"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr" },
          gap: 1,
        }}
      >
        <DataRow label="Node PubKey" value={hexResponse.node_pubkey} />
        <DataRow
          label="Consensus PubKey"
          value={hexResponse.consensus_pubkey}
        />
        <DataRow
          label="Withdrawal Creds"
          value={hexResponse.withdrawal_credentials}
        />
        <DataRow label="Node Sig" value={hexResponse.node_signature} />
        <DataRow
          label="Consensus Sig"
          value={hexResponse.consensus_signature}
        />
        <DataRow
          label="Deposit Data Root"
          value={hexResponse.deposit_data_root}
        />
      </Box>
    </>
  );
};
