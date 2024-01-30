import { useROOT } from '@rootlabs/did-manager'
import { useDialog } from 'app/hooks/useDialog'
import { useMount } from 'app/hooks/useMount'
import { createContext } from 'app/utils/createContext'
import * as localStorage from 'app/utils/cache/localStorage'
import * as sessionStorage from 'app/utils/cache/sessionStorage'
import type { ProfileModel, DIDInfo, WithMeta } from '@rootlabs/client'
import { useCallback, useEffect, useState } from 'react'
import { getProfile } from '../nft3/profile/adapter'

const useUserService = () => {
  const selectDialog = useDialog()
  const registerDialog = useDialog()
  const { chainId, account, didname, ready, login, selectWallet, logout, register, client, identifier, disconnect } = useROOT()
  const [profile, setProfileInternal] = useState<WithMeta<ProfileModel>>({} as any)
  const [didinfo, setDidinfo] = useState<DIDInfo>()

  useMount(() => {
    const sessionKey = sessionStorage.getItem('sessionKey')
    if (!sessionKey) return selectDialog.open()
    const wallet = localStorage.getItem('wallet')
    if (wallet) {
      selectWallet(wallet).then((value) => {
        if (!value) selectDialog.open()
      })
    }
  })

  const updateProfile = useCallback(() => {
    if (!identifier) return
    return client.profile.info(identifier).then((profile) => {
      if (!profile) return
      setProfileInternal(getProfile(profile) as any)
    })
  }, [client.profile, identifier])

  const updateDidInfo = useCallback(() => {
    if (!identifier) return
    return client.did.info(identifier).then((didinfo) => {
      setDidinfo(didinfo)
    })
  }, [client.did, identifier])

  useEffect(() => {
    if (!identifier) return
    const promises = []
    promises.push(updateProfile())
    promises.push(updateDidInfo())
    Promise.all(promises)
  }, [identifier, client, updateProfile, updateDidInfo])

  return {
    selectDialog,
    registerDialog,

    chainId,
    account,
    didname,
    ready,
    login,
    selectWallet,
    logout,
    disconnect,
    register,

    client,
    identifier,
    profile,
    didinfo,
  }
}
const { Provider: UserProvider, createUseContext } = createContext(useUserService)
export const createUserContext = createUseContext

export default UserProvider
