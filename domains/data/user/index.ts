import { useNFT3 } from '@nft3sdk/did-manager'
import { useDialog } from 'app/hooks/useDialog'
import { useMount } from 'app/hooks/useMount'
import { createContext } from 'app/utils/createContext'
import * as localStorage from 'app/utils/cache/localStorage'
import * as sessionStorage from 'app/utils/cache/sessionStorage'
import type { WithMeta, ProfileModel } from '@nft3sdk/client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getProfile } from '../nft3/profile/adapter'

const useUserService = () => {
  const selectDialog = useDialog()
  const registerDialog = useDialog()
  const { account, didname, ready, login, selectWallet, logout, register, client, identifier, disconnect } = useNFT3()
  const [profile, setProfileInternal] = useState<WithMeta<ProfileModel>>({} as any)
  const did = useMemo(() => {
    if (!didname) return
    if (didname.startsWith('did:')) return didname
    return client.did.convertName(didname)
  }, [didname, client.did])

  useMount(() => {
    const sessionKey = sessionStorage.getItem('sessionKey')
    if (!sessionKey) return
    const wallet = localStorage.getItem('wallet')
    if (wallet) selectWallet(wallet)
  })

  const updateProfile = useCallback(() => {
    if (!identifier) return
    return client.profile.info(identifier).then((profile) => {
      if (!profile) return
      setProfileInternal(getProfile(profile) as any)
    })
  }, [client.profile, identifier])

  useEffect(() => {
    if (!identifier) return
    const promises = []
    promises.push(updateProfile())
    Promise.all(promises)
  }, [identifier, client, updateProfile])

  return {
    selectDialog,
    registerDialog,

    account,
    didname,
    did,
    ready,
    login,
    selectWallet,
    logout,
    disconnect,
    register,

    client,
    identifier,
    profile,
  }
}
const { Provider: UserProvider, createUseContext } = createContext(useUserService)
export const createUserContext = createUseContext

export default UserProvider
