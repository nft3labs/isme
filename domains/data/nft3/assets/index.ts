import { createContext } from 'app/utils/createContext'
import { useNFT3Profile } from 'domains/data'
import { useState, useMemo, useCallback, useEffect } from 'react'
import type { TokenRecord, OpenseaAssetsRecord, TxRecord } from '@nft3sdk/client'
import { NFT3Queryer } from '@nft3sdk/client'

const useAssetsService = () => {
  const { did: identifier, didinfo } = useNFT3Profile()
  const [nfts, setNfts] = useState<OpenseaAssetsRecord[]>([])
  const [tokens, setTokens] = useState<TokenRecord[]>([])
  const [txs, setTxs] = useState<TxRecord[]>([])

  const queryer = useMemo(() => {
    return new NFT3Queryer('http://t0.onebitdev.com:10001/')
  }, [])

  const updateAssets = useCallback(async () => {
    if (!identifier) {
      setTokens([])
      setNfts([])
      setTxs([])
      return
    }
    const data = await queryer.query({
      tokens: {
        did: identifier,
      },
      txs: {
        did: identifier,
      },
    })
    setTokens(data.tokens)
    setTxs(data.txs)
  }, [identifier, queryer])

  const openseaAssets = useCallback(
    async (owner: string) => {
      const result = await queryer.openseaAssets({
        owner,
        limit: 50,
      })
      setNfts(result.assets)
    },
    [queryer]
  )

  useEffect(() => {
    updateAssets()
  }, [updateAssets])

  useEffect(() => {
    if (didinfo?.addresses?.length) {
      openseaAssets(didinfo.addresses[0].split(':')[1])
    }
  }, [didinfo, openseaAssets])

  return {
    tokens,
    nfts,
    txs,
  }
}
const { Provider: AssetsProvider, createUseContext } = createContext(useAssetsService)
export const createAssetsContext = createUseContext

export default AssetsProvider
