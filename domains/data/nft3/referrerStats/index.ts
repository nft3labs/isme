import { useCallback, useEffect, useState } from 'react'
import { createContext } from 'app/utils/createContext'
import { useNFT3, useUser } from 'domains/data'
type NFT3ReferrerStats = {
  invitees: number
  verified_invitess: number
  reward: number
  claimable_reward: number
}

const useReferrerStatsService = () => {
  const { queryer } = useNFT3()
  const { didname, identifier } = useUser()

  const [loading, setLoading] = useState(false)
  const [referrerStats, setReferrerStats] = useState<NFT3ReferrerStats>({} as any)

  const request = useCallback(
    () => {
      if (loading || !didname) return
      setLoading(true)
      return queryer
        .query({
          nft3ReferrerStats: {
            did: identifier,
          },
        })
        .then((data: any) => {
          setReferrerStats(data.nft3ReferrerStats)
        })
        .finally(() => {
          setLoading(false)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryer, didname]
  )

  useEffect(() => {
    request()
  }, [request])

  return {
    referrerStats,
    loading,
  }
}
const { Provider: ReferrerStatsProvider, createUseContext } = createContext(useReferrerStatsService)
export const createReferrerStatsContext = createUseContext

export default ReferrerStatsProvider
