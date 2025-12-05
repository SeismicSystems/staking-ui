import { useState, useEffect, useCallback } from "react";

export interface UserStats {
  address: string;
  total_deposits: string;
  total_deposit_amount: string;
  total_withdrawals: string;
  total_withdrawal_amount: string;
  net_amount: string;
  first_deposit_timestamp: string;
  last_deposit_timestamp: string;
  last_withdrawal_timestamp?: string;
}

export interface GlobalStats {
  total_deposits: string;
  total_deposit_amount: string;
  total_withdrawals: string;
  total_withdrawal_amount: string;
  net_amount: string;
  unique_depositors: string;
  last_updated: string;
}

export interface Deposit {
  id: string;
  amount: string;
  block_timestamp: string;
  transaction_hash: string;
  deposit_index: string;
}

const INDEXER_API_URL =
  import.meta.env.VITE_INDEXER_API_URL || "http://localhost:42069";

export function useUserStats(address: string | undefined) {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
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
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
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
