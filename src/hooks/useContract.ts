


const parseChainId = (): number => {
    const chainId = import.meta.env.VITE_CHAIN_ID
    if (!chainId) {
        throw new Error('CHAIN_ID is not set')
    }
    return parseInt(chainId)
}

export const CHAIN_ID = parseChainId()

