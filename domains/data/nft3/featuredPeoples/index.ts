import { useNFT3 } from '@nft3sdk/did-manager'
import { useEffect, useState } from 'react'
import { DEFAULT_AVATARS, getFilePath } from 'app/constant'
import type { FollowMember } from 'components/Follow/types'
import { createContext } from 'app/utils/createContext'

const useFeaturedPeoplesService = () => {
  const { client } = useNFT3()
  const [featuredPeoples, setFeaturedPeoples] = useState<FollowMember[]>([])

  useEffect(() => {
    if (!client.did) return
    client.did.featured().then((data) => {
      setFeaturedPeoples(
        data
          .filter((item) => item && item.profile)
          .map((item, index) => {
            return {
              identifier: item.did,
              name: item.profile.name,
              avatar: item.profile.avatar || getFilePath(DEFAULT_AVATARS[index % DEFAULT_AVATARS.length]),
              bio: item.profile.bio || '',
            } as FollowMember
          })
      )
    })
  }, [client.did])

  return {
    featuredPeoples,
  }
}
const { Provider: FeaturedPeoplesProvider, createUseContext } = createContext(useFeaturedPeoplesService)
export const createFeaturedPeoplesContext = createUseContext

export default FeaturedPeoplesProvider
