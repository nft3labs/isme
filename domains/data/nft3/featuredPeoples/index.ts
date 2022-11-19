import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_AVATARS, getFilePath } from 'app/constant'
import type { FollowMember } from 'components/Follow/types'
import { createContext } from 'app/utils/createContext'
import { useNFT3 } from 'domains/data'
const limit = 12

const useFeaturedPeoplesService = () => {
  const { queryer } = useNFT3()

  const [loading, setLoading] = useState(false)
  const [isEnd, setIsEnd] = useState(false)
  const [offset, setOffset] = useState(0)
  const [featuredPeoples, setFeaturedPeoples] = useState<FollowMember[]>([])

  const request = useCallback(
    (offset: number) => {
      if (loading) return
      setLoading(true)
      return queryer
        .query({
          nft3Featured: {
            offset,
            limit,
          },
        })
        .then((data) => {
          setFeaturedPeoples((featuredPeoples) => {
            return featuredPeoples.concat(
              data.nft3Featured
                .filter((item) => item && item.profile)
                .map((item, index) => {
                  return {
                    identifier: item.did,
                    name: item.profile.name,
                    avatar: item.profile.avatar || getFilePath(DEFAULT_AVATARS[index % DEFAULT_AVATARS.length]),
                    bio: item.profile.bio || '',
                    followers: item.followers,
                  } as FollowMember
                })
            )
          })
          if (data.nft3Featured.length < limit) {
            setIsEnd(true)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryer]
  )

  const loadMoreData = useCallback(() => {
    const o = offset + limit
    setOffset(o)
    request(o)
  }, [offset, request])

  const reset = useCallback(() => {
    setLoading(false)
    setOffset(0)
    setFeaturedPeoples([])
    setIsEnd(false)
  }, [])

  useEffect(() => {
    request(0)
  }, [request])

  return {
    featuredPeoples,
    isEnd,
    loading,
    loadMoreData,
    reset,
  }
}
const { Provider: FeaturedPeoplesProvider, createUseContext } = createContext(useFeaturedPeoplesService)
export const createFeaturedPeoplesContext = createUseContext

export default FeaturedPeoplesProvider
