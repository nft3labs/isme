import { createContext } from 'app/utils/createContext'
import { useNFT3, useNFT3Profile } from 'domains/data'
import { useState, useCallback, useEffect } from 'react'
import type { TokenRecord, OpenseaAssetsRecord, ENSRecord, TimelineRecord, POAPRecord } from '@nft3sdk/client'
import { useTimeline } from './timeline'

const useAssetsService = () => {
  const { queryer } = useNFT3()
  const [openseaLoading, setOpenseaLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const { did: identifier, didinfo } = useNFT3Profile()
  const [nfts, setNfts] = useState<OpenseaAssetsRecord[]>([])
  const [tokens, setTokens] = useState<TokenRecord[]>([])
  // const [txs, setTxs] = useState<TxRecord[]>([])
  const [ens, setEns] = useState<ENSRecord[]>([])
  const [timelineData, setTimelineData] = useState<TimelineRecord[]>([])
  const [poaps, setPoaps] = useState<POAPRecord[]>([])

  const updateAssets = useCallback(async () => {
    if (!identifier) {
      setTokens([])
      setNfts([])
      setPoaps([])
      // setTxs([])
      return
    }
    setLoading(true)

    try {
      const data = await queryer.query({
        tokens: {
          did: identifier,
        },
        poaps: {
          did: identifier,
        },
        // txs: {
        //   did: identifier,
        // },
        ens: {
          did: identifier,
        },
        timeline: {
          did: identifier,
        },
      })
      setTokens(data.tokens || [])
      // setTxs(data.txs || [])
      setEns(data.ens || [])
      setTimelineData(data.timeline || [])
      setPoaps(data.poaps || [])
    } catch (e) {}

    setLoading(false)
  }, [identifier, queryer])

  const openseaAssets = useCallback(
    async (owner: string) => {
      setOpenseaLoading(true)
      try {
        const result = await queryer.openseaAssets({
          owner,
          limit: 50,
        })
        setNfts(result.assets)
      } catch (e) {}
      setOpenseaLoading(false)
    },
    [queryer]
  )

  const timeline = useTimeline({
    baseData: timelineData,
    baseLoading: loading,
    queryer,
    identifier,
  })

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
    // txs,
    ens,
    timeline,
    poaps,

    loading,
    openseaLoading,
  }
}
const { Provider: AssetsProvider, createUseContext } = createContext(useAssetsService)
export const createAssetsContext = createUseContext

export default AssetsProvider
