import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ProfileModel, DIDInfo } from '@nft3sdk/client'
import { createContext } from 'app/utils/createContext'

import { useUser } from 'domains/data'

const useProfileService = () => {
  const [ready, setReady] = useState(false)
  const [didname, setDidname] = useState('')
  const { client } = useUser()
  const did = useMemo(() => {
    if (!didname) return
    return client.did.convertName(didname!)
  }, [didname, client.did])

  const [didinfo, setDidinfo] = useState<DIDInfo>()
  const [profile, setProfileInternal] = useState<ProfileModel>({} as any)

  const updateProfile = useCallback(() => {
    return client.profile.info(did).then((profile) => {
      if (!profile) return
      setProfileInternal(profile)
    })
  }, [client.profile, did])

  const setProfile = useCallback(
    async (data: ProfileModel) => {
      const result = await client.profile.update(data)
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

  return {
    ready,
    didname,
    did,
    profile,
    didinfo,

    setDidname,
    setProfile,
  }
}
const { Provider: ProfileProvider, createUseContext } = createContext(useProfileService)
export const createProfileContext = createUseContext

export default ProfileProvider
