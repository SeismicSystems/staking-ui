import { useState, useEffect, useCallback } from "react";
import type {
  UserStatsResponse,
  GlobalStatsResponse,
  DepositResponse,
} from "@staking-ui/indexer/types";

export type {
  UserStatsResponse as UserStats,
  GlobalStatsResponse as GlobalStats,
  DepositResponse as Deposit,
};

const INDEXER_API_URL =
  import.meta.env.VITE_INDEXER_API_URL || "http://localhost:42069";

export function useUserStats(address: string | undefined) {
  const [userStats, setUserStats] = useState<UserStatsResponse | null>(null);
  const [deposits, setDeposits] = useState<DepositResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserStats = useCallback(async () => {
    if (!address) {
      setUserStats(null);
      setDeposits([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${INDEXER_API_URL}/deposits/${address}`);
      const data = await response.json();

      if (data.success) {
        setUserStats(data.data.depositor);
        setDeposits(data.data.deposits);
      } else {
        setError(data.error || "Failed to fetch user stats");
      }
    } catch (err) {
      setError("Failed to connect to indexer");
      console.error("Error fetching user stats:", err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  return { userStats, deposits, loading, error, refetch: fetchUserStats };
}

export function useGlobalStats() {
  const [globalStats, setGlobalStats] = useState<GlobalStatsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGlobalStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${INDEXER_API_URL}/stats`);
      const data = await response.json();

      if (data.success) {
        setGlobalStats(data.data);
      } else {
        setError(data.error || "Failed to fetch global stats");
      }
    } catch (err) {
      setError("Failed to connect to indexer");
      console.error("Error fetching global stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGlobalStats();
  }, [fetchGlobalStats]);

  return { globalStats, loading, error, refetch: fetchGlobalStats };
}
