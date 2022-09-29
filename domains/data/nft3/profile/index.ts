import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ProfileModel, DIDInfo } from '@nft3sdk/client'
import { createContext } from 'app/utils/createContext'

import { useUser } from 'domains/data'
import { getProfile } from './adapter'

const useProfileService = () => {
  const [ready, setReady] = useState(false)
  const { client, identifier } = useUser()
  const [didname, setDidname] = useState('')
  const did = useMemo(() => {
    if (!didname) return
    if (didname.startsWith('did:')) return didname
    return client.did.convertName(didname)
  }, [didname, client.did])

  const [didinfo, setDidinfo] = useState<DIDInfo>()
  const [profile, setProfileInternal] = useState<ProfileModel & { createdAt: number }>({} as any)

  const updateProfile = useCallback(() => {
    return client.profile.info(did).then((profile) => {
      if (!profile) return
      setProfileInternal(getProfile(profile) as any)
    })
  }, [client.profile, did])

  const setProfile = useCallback(
    async (data: Partial<ProfileModel>) => {
      const result = await client.profile.update(data as any)
      updateProfile()
      return result
    },
    [client.profile, updateProfile]
  )

  useEffect(() => {
    if (!did) return
    setReady(false)
    const promises = []
    promises.push(
      client.did.info(did).then((didinfo) => {
        setDidinfo(didinfo)
      })
    )
    promises.push(updateProfile())
    Promise.all(promises).then(() => {
      setReady(true)
    })
  }, [did, client, updateProfile])

  const isUser = useMemo(() => did === identifier, [did, identifier])

  return {
    ready,
    didname,
    did,
    profile,
    didinfo,

    setDidname,
    setProfile,

    isUser,
  }
}
const { Provider: ProfileProvider, createUseContext } = createContext(useProfileService)
export const createProfileContext = createUseContext

export default ProfileProvider
