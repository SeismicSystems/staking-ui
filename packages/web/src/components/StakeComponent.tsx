import { Box, Button, Typography, Alert, TextField } from "@mui/material";
import { useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { useShieldedWallet } from "seismic-react";
import { type Hex, parseEther, formatEther } from "viem";

interface StakeComponentProps {
  depositSignatureData: {
    node_pubkey: number[];
    consensus_pubkey: number[];
    withdrawal_credentials: number[];
    node_signature: number[];
    consensus_signature: number[];
    deposit_data_root: number[];
  } | null;
  balance: bigint | null;
  stakeAmount: string;
  onStakeAmountChange: (amount: string) => void;
  userAddress: string | undefined;
  onBalanceUpdate: () => Promise<void>;
}

const toHex = (arr: number[]): Hex => {
  return `0x${arr.map((b) => b.toString(16).padStart(2, "0")).join("")}`;
};

export const StakeComponent = ({
  depositSignatureData,
  balance,
  stakeAmount,
  onStakeAmountChange,
  userAddress,
  onBalanceUpdate,
}: StakeComponentProps) => {
  const { walletClient, publicClient } = useShieldedWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleDeposit = async () => {
    if (!walletClient || !userAddress) return;

    const stakeAmountBigInt = parseEther(stakeAmount);

    console.log("Balance:", balance?.toString());
    console.log("Stake Amount:", stakeAmountBigInt.toString());

    // Add a small buffer for gas (e.g., 0.01 ETH)
    const minRequiredBalance = stakeAmountBigInt + parseEther("0.01");

    if (!balance || balance < minRequiredBalance) {
      setError(
        `Insufficient funds. You need at least ${
          parseFloat(stakeAmount) + 0.01
        } ETH (${stakeAmount} ETH stake + gas). Your balance: ${
          balance ? formatEther(balance) : "0"
        } ETH`,
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Fetch deposit signature with the user's selected amount
      const amountInGwei = Math.floor(parseFloat(stakeAmount) * 1_000_000_000);
      const response = await fetch(
        `/summit/get_deposit_signature/${amountInGwei}/${userAddress}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch deposit signature");
      }

      const signatureData = await response.json();

      const args = [
        toHex(signatureData.node_pubkey),
        toHex(signatureData.consensus_pubkey),
        toHex(signatureData.withdrawal_credentials),
        toHex(signatureData.node_signature),
        toHex(signatureData.consensus_signature),
        toHex(signatureData.deposit_data_root),
      ] as const;

      // Manually calling writeContract to ensure value is passed correctly
      // The helper might be misconfigured or using a different internal call
      const hash = await walletClient.deposit({
        nodePubkey: args[0],
        consensusPubkey: args[1],
        withdrawalCredentials: args[2],
        nodeSignature: args[3],
        consensusSignature: args[4],
        depositDataRoot: args[5],
        value: stakeAmountBigInt,
      });

      setTxHash(hash);

      // Wait for the transaction to be confirmed before refreshing balance
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
        await onBalanceUpdate();
      }
    } catch (err: any) {
      console.error("Deposit failed:", err);
      // Extract the most relevant error message
      const message =
        err.walk?.((e: any) => e.shortMessage)?.shortMessage ||
        err.shortMessage ||
        err.message ||
        "Deposit failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!depositSignatureData) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 4,
        width: "100%",
        height: "10rem",
      }}
    >
      {isLoading ? (
        <>
          <Typography variant="h6">Staking in progress...</Typography>
          <LoadingSpinner size={100} />
        </>
      ) : txHash ? (
        <Alert
          severity="success"
          sx={{
            width: "100%",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Deposit successful! Tx: {txHash}
        </Alert>
      ) : (
        <>
          {error && (
            <Alert
              severity="error"
              sx={{
                width: "100%",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                mb: 2,
              }}
            >
              {error}
            </Alert>
          )}
          <TextField
            label="Amount to Stake (ETH)"
            type="number"
            value={stakeAmount}
            onChange={(e) => onStakeAmountChange(e.target.value)}
            inputProps={{
              min: "0",
              step: "0.01",
            }}
            error={parseFloat(stakeAmount) > 32}
            sx={{
              mb: 2,
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            helperText={
              parseFloat(stakeAmount) > 32
                ? "Amount exceeds maximum of 32 ETH"
                : "Maximum: 32 ETH"
            }
          />
          <Button
            sx={{ width: "100%", height: "100%", borderRadius: 5 }}
            variant="contained"
            size="large"
            onClick={handleDeposit}
            disabled={
              !walletClient ||
              parseFloat(stakeAmount) > 32 ||
              parseFloat(stakeAmount) <= 0 ||
              !stakeAmount
            }
          >
            <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              Stake {stakeAmount} ETH
            </Typography>
          </Button>
        </>
      )}
    </Box>
  );
};
