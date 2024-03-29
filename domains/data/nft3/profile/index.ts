import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ProfileModel, DIDInfo, WithMeta } from '@rootlabs/client'
import { createContext } from 'app/utils/createContext'
import { merge } from 'lodash'

import { useUser } from 'domains/data'
import { getProfile } from './adapter'
import { safeGet } from 'app/utils/get'

const useProfileService = () => {
  const [ready, setReady] = useState(false)
  const { client, identifier, didname: userDidname } = useUser()
  const [didname, setDidname] = useState('')
  const did = useMemo(() => {
    if (!didname) return
    if (didname.startsWith('did:')) return didname
    return client.did.convertName(didname)
  }, [didname, client.did])

  const [didinfo, setDidinfo] = useState<DIDInfo>()
  const [profile, setProfileInternal] = useState<WithMeta<ProfileModel>>({} as any)

  const updateProfile = useCallback(() => {
    return client.profile.info(did).then((profile: any) => {
      if (!profile) return
      setProfileInternal(getProfile(profile) as any)
    })
  }, [client.profile, did])

  const updateDidInfo = useCallback(() => {
    return client.did.info(did).then((didinfo: any) => {
      setDidinfo(didinfo)
    })
  }, [client.did, did])

  const setProfile = useCallback(
    async (data: Partial<ProfileModel>) => {
      const info = await client.profile.info()
      data = merge(info, data)
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
    promises.push(updateDidInfo())
    promises.push(updateProfile())
    Promise.all(promises).then(() => {
      setReady(true)
    })
  }, [did, client, updateProfile, updateDidInfo])

  const isUser = useMemo(() => did === identifier, [did, identifier])

  return {
    ready,
    didname,
    did,
    profile,
    didinfo,

    setDidname,
    setProfile,
    setProfileInternal,
    updateProfile,
    updateDidInfo,

    isUser,
    needClaim: safeGet(() => !userDidname && !didinfo.ctrl_keys.length),
  }
}
const { Provider: ProfileProvider, createUseContext } = createContext(useProfileService)
export const createProfileContext = createUseContext

export default ProfileProvider
