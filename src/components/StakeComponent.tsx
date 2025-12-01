import { Box, Button, Typography, Alert } from "@mui/material";
import { useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { useShieldedWallet } from "seismic-react";
import { type Hex, parseEther, formatEther } from "viem";
import { DEPOSIT_CONTRACT_ADDRESS } from "seismic-viem";

const VALIDATOR_MINIMUM_STAKE = parseEther("32");

const depositAbi = [
  {
    type: "function",
    name: "deposit",
    inputs: [
      { name: "node_pubkey", type: "bytes", internalType: "bytes" },
      { name: "consensus_pubkey", type: "bytes", internalType: "bytes" },
      { name: "withdrawal_credentials", type: "bytes", internalType: "bytes" },
      { name: "node_signature", type: "bytes", internalType: "bytes" },
      { name: "consensus_signature", type: "bytes", internalType: "bytes" },
      { name: "deposit_data_root", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
] as const;

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
}

const toHex = (arr: number[]): Hex => {
  return `0x${arr.map((b) => b.toString(16).padStart(2, "0")).join("")}`;
};

export const StakeComponent = ({
  depositSignatureData,
  balance,
}: StakeComponentProps) => {
  const { walletClient, publicClient } = useShieldedWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDeposit = async () => {
    if (!walletClient || !depositSignatureData) return;

    const stakeAmount = parseEther("32");

    console.log("Balance:", balance?.toString());
    console.log("Stake Amount:", stakeAmount.toString());

    // Add a small buffer for gas (e.g., 0.01 ETH)
    const minRequiredBalance = stakeAmount + parseEther("0.01");

    if (!balance || balance < minRequiredBalance) {
      setError(
        `Insufficient funds. You need at least 32.01 ETH (32 ETH stake + gas). Your balance: ${
          balance ? formatEther(balance) : "0"
        } ETH`
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const args = [
        toHex(depositSignatureData.node_pubkey),
        toHex(depositSignatureData.consensus_pubkey),
        toHex(depositSignatureData.withdrawal_credentials),
        toHex(depositSignatureData.node_signature),
        toHex(depositSignatureData.consensus_signature),
        toHex(depositSignatureData.deposit_data_root)
      ] as const;

      // // Try to simulate first to catch specific errors
      // if (publicClient && walletClient.account) {
      //   console.log("Staking amount:", stakeAmount.toString());
      //   console.log("Validator minimum stake:", VALIDATOR_MINIMUM_STAKE.toString());
      //   console.log("publicClient.rpcUrl", publicClient.transport.url);
      //   console.log("DEPOSIT_CONTRACT_ADDRESS", DEPOSIT_CONTRACT_ADDRESS);
      //   console.log("walletClient.account", walletClient.account);
      //   try {
      //     console.log("Simulating deposit with value:", stakeAmount.toString());
      //     console.log("Args:", args);
      //     await publicClient.simulateContract({
      //       account: walletClient.account,
      //       address: DEPOSIT_CONTRACT_ADDRESS,
      //       abi: depositAbi,
      //       functionName: "deposit",
      //       args: [...args],
      //       value: stakeAmount,
      //     });
      //   } catch (simError: any) {
      //     console.warn("Simulation failed:", simError);
      //     // If simulation fails with the specific error, throw it to be caught below
      //     throw simError;
      //   }
      // }

      // Manually calling writeContract to ensure value is passed correctly
      // The helper might be misconfigured or using a different internal call
      const hash = await walletClient.deposit({
        address: DEPOSIT_CONTRACT_ADDRESS,
        nodePubkey: args[0],
        consensusPubkey: args[1],
        withdrawalCredentials: args[2],
        nodeSignature: args[3],
        consensusSignature: args[4],
        depositDataRoot: args[5],
        value: VALIDATOR_MINIMUM_STAKE,
      });
      console.log("walletClient.deposit exists?", typeof walletClient.deposit);
      console.log("walletClient methods:", Object.keys(walletClient));
      // const hash = await walletClient.writeContract({
      //   address: DEPOSIT_CONTRACT_ADDRESS,
      //   abi: depositAbi,
      //   functionName: "deposit",
      //   args: args,
      //   value: VALIDATOR_MINIMUM_STAKE,
      //   // gas: 1000000,
      // });

      setTxHash(hash);
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
        gap: 2,
      }}
    >
      {isLoading ? (
        <>
          <Typography variant="h6">Staking in progress...</Typography>
          <LoadingSpinner size={100} />
        </>
      ) : txHash ? (
        <Alert severity="success">Deposit successful! Tx: {txHash}</Alert>
      ) : (
        <>
          {error && (
            <Alert
              severity="error"
              sx={{ maxWidth: "400px", wordBreak: "break-word" }}
            >
              {error}
            </Alert>
          )}
          <Button
            variant="contained"
            size="large"
            onClick={handleDeposit}
            disabled={!walletClient}
          >
            Stake 32 ETH
          </Button>
        </>
      )}
    </Box>
  );
};
