import type { WalletType } from '@nft3sdk/did-manager'
import { useNFT3 } from '@nft3sdk/did-manager'
import { useDialog } from 'app/hooks/useDialog'
import { useMount } from 'app/hooks/useMount'
import { createContext } from 'app/utils/createContext'
import * as localStorage from 'app/utils/cache/localStorage'
import * as sessionStorage from 'app/utils/cache/sessionStorage'
import type { ProfileModel, DIDInfo, WithMeta } from '@nft3sdk/client'
import { useCallback, useEffect, useState } from 'react'
import { getProfile } from '../nft3/profile/adapter'

const useUserService = () => {
  const selectDialog = useDialog()
  const registerDialog = useDialog()
  const { chainId, account, didname, ready, login, selectWallet, logout, register, client, identifier, disconnect } = useNFT3()
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

  // const selectWallet = useCallback(
  //   async (wallet: WalletType) => {
  //     console.log('yay: ', wallet)
  //     return selectWalletRaw(wallet)
  //       .then((value) => {
  //         console.log('yoy: ', value)
  //         return value
  //       })
  //       .catch((err) => {
  //         console.log('oii: ', err)
  //         throw err
  //       })
  //   },
  //   [selectWalletRaw]
  // )

  // const login = useCallback(async () => {
  //   console.log('login yay')
  //   return loginRaw()
  //     .then((value) => {
  //       console.log('login yoy: ', value)
  //       return value
  //     })
  //     .catch((err) => {
  //       console.log('login oii: ', err)
  //       throw err
  //     })
  // }, [loginRaw])

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
