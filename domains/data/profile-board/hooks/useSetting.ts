import { useCallback, useEffect, useState } from 'react'
import type { ProfileModel } from '@nft3sdk/client'
import { useNFT3 } from '@nft3sdk/did-manager'

export default function useProfile() {
  const [profile, setProfile] = useState<ProfileModel>()
  const { identifier, client } = useNFT3()

  const info = useCallback(async () => {
    if (!identifier) {
      setProfile(undefined)
      return
    }
    const profile = await client.profile.info()
    setProfile(profile)
  }, [identifier, client])

  const update = useCallback(
    async (data: ProfileModel) => {
      const result = await client.profile.update(data)
      info()
      return result
    },
    [client.profile, info]
  )

  useEffect(() => {
    info()
  }, [info])

  return {
    profile,
    update,
  }
}
