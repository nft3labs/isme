import { useCallback, useState } from 'react'
import type { ProfileModel, DIDInfo } from '@nft3sdk/client'
import { useNFT3 } from '@nft3sdk/did-manager'

export default function useProfile(identifier: string) {
  const [didinfo, setDidinfo] = useState<DIDInfo>()
  const [profile, setProfile] = useState<ProfileModel>()
  const { client } = useNFT3()

  const info = useCallback(async () => {
    const [didinfo, profile] = await Promise.all([client.did.info(identifier), client.profile.info(identifier)])
    setDidinfo(didinfo)
    setProfile(profile)
  }, [identifier, client])

  return {
    profile,
    didinfo,
    info,
  }
}
