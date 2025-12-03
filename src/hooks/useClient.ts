import { useCallback, useEffect, useState } from "react"
import type { Hex } from "viem"
import { useShieldedWallet } from "seismic-react"

export const useClient = () => {
    const [loaded, setLoaded] = useState(false)

    const [walletAddress, setWalletAddress] = useState<Hex | null>(null)
    const { walletClient } = useShieldedWallet()

    useEffect(() => {
        setLoaded(true)
    }, [])

    useEffect(() => {
        if (!loaded || !walletClient || !walletClient.account) {
            return
        }

        setWalletAddress(walletClient.account.address)
    }, [loaded, walletClient])

    const balanceEthWallet = useCallback(async (): Promise<bigint> => {
        if (!walletClient || !walletAddress) {
            return BigInt(0)
        }

        return await walletClient.getBalance({
            address: walletAddress,
        })
    }, [walletClient, walletAddress])

    return {
        walletAddress,
        balanceEthWallet,
    }
}