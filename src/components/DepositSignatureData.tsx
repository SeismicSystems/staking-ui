import { useMemo } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
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
  isWalletConnected: boolean;
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

        backgroundColor: theme.palette.background.paper,
        borderRadius: 5,
        padding: 2,
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
        {value ? (
          <>
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
          </>
        ) : (
          <CircularProgress size={20} />
        )}
      </Box>
    </Box>
  );
};

export const DepositSignatureData = ({
  depositSignatureData,
  isWalletConnected,
}: DepositSignatureDataProps) => {
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

  const getValue = (val: string) => {
    if (!isWalletConnected) return "0000000";
    return val;
  };

  return (
    <>
      <Box
        className="deposit-signature-data"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", lg: "1fr 1fr 1fr" },
          gap: 1,
        }}
      >
        <DataRow
          label="Node PubKey"
          value={getValue(hexResponse.node_pubkey)}
        />
        <DataRow
          label="Consensus PubKey"
          value={getValue(hexResponse.consensus_pubkey)}
        />
        <DataRow
          label="Withdrawal Creds"
          value={getValue(hexResponse.withdrawal_credentials)}
        />
        <DataRow
          label="Node Sig"
          value={getValue(hexResponse.node_signature)}
        />
        <DataRow
          label="Consensus Sig"
          value={getValue(hexResponse.consensus_signature)}
        />
        <DataRow
          label="Deposit Data Root"
          value={getValue(hexResponse.deposit_data_root)}
        />
      </Box>
    </>
  );
};
