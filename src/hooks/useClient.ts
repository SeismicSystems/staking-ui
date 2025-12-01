import { useCallback, useEffect, useState } from "react"
import type { Hex } from "viem"
import { useShieldedWallet } from "seismic-react"

import { type ShieldedPublicClient } from "seismic-viem"

export const useClient = () => {
    const [loaded, setLoaded] = useState(false)

    const [walletAddress, setWalletAddress] = useState<Hex | null>(null)
    const { walletClient, publicClient } = useShieldedWallet()

    useEffect(() => {
        setLoaded(true)
    }, [])

    useEffect(() => {
        if (!loaded || !walletClient || !walletClient.account) {
            return
        }

        setWalletAddress(walletClient.account.address)
    }, [loaded, walletClient])

    const connectedAddress = useCallback(() => {

        if (!walletAddress) {
            throw new Error('Wallet address not found')
        }
        return walletAddress
    }, [walletAddress])


    const pubClient = useCallback((): ShieldedPublicClient => {
        if (!publicClient) {
            throw new Error('Public client not found')
        }
        return publicClient
    }, [publicClient])

    const balanceEthWallet = useCallback(async (): Promise<bigint> => {

        return await pubClient().getBalance({
            address: connectedAddress(),
        })
    }, [connectedAddress, pubClient])

    return {
        walletAddress,
        balanceEthWallet,
    }
}