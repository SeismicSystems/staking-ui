import { Box, Typography, Paper, Skeleton, Grid } from "@mui/material";
import { formatEther } from "viem";
import type { UserStats, GlobalStats } from "../hooks/useStats";

interface StatsDisplayProps {
  userStats: UserStats | null;
  globalStats: GlobalStats | null;
  userLoading: boolean;
  globalLoading: boolean;
}

// Amount from indexer is in gwei, convert to ETH
const gweiToEth = (gweiStr: string) => {
  const gwei = BigInt(gweiStr);
  const wei = gwei * BigInt(1_000_000_000); // gwei to wei
  return Number(formatEther(wei)).toFixed(4);
};

export const StatsDisplay = ({
  userStats,
  globalStats,
  userLoading,
  globalLoading,
}: StatsDisplayProps) => {
  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      {/* Global Stats */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Network Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid size={4}>
            <Typography variant="caption" color="text.secondary">
              Total Staked
            </Typography>
            {globalLoading ? (
              <Skeleton width={80} />
            ) : (
              <Typography variant="body1" fontWeight="bold">
                {globalStats
                  ? `${gweiToEth(globalStats.total_amount)} ETH`
                  : "—"}
              </Typography>
            )}
          </Grid>
          <Grid size={4}>
            <Typography variant="caption" color="text.secondary">
              Total Deposits
            </Typography>
            {globalLoading ? (
              <Skeleton width={60} />
            ) : (
              <Typography variant="body1" fontWeight="bold">
                {globalStats?.total_deposits || "—"}
              </Typography>
            )}
          </Grid>
          <Grid size={4}>
            <Typography variant="caption" color="text.secondary">
              Unique Stakers
            </Typography>
            {globalLoading ? (
              <Skeleton width={60} />
            ) : (
              <Typography variant="body1" fontWeight="bold">
                {globalStats?.unique_depositors || "—"}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* User Stats */}
      {userStats && (
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Your Staking Stats
          </Typography>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography variant="caption" color="text.secondary">
                Your Total Staked
              </Typography>
              {userLoading ? (
                <Skeleton width={80} />
              ) : (
                <Typography variant="body1" fontWeight="bold">
                  {gweiToEth(userStats.total_amount)} ETH
                </Typography>
              )}
            </Grid>
            <Grid size={6}>
              <Typography variant="caption" color="text.secondary">
                Your Deposits
              </Typography>
              {userLoading ? (
                <Skeleton width={60} />
              ) : (
                <Typography variant="body1" fontWeight="bold">
                  {userStats.total_deposits}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};
