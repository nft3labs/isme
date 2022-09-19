import { useNFT3 } from '@nft3sdk/did-manager'
import { useDialog } from 'app/hooks/useDialog'
import { useMount } from 'app/hooks/useMount'
import { createContext } from 'app/utils/createContext'
import * as localStorage from 'app/utils/cache/localStorage'
import * as sessionStorage from 'app/utils/cache/sessionStorage'

const useUserService = () => {
  const selectDialog = useDialog()
  const registerDialog = useDialog()
  const { account, didname, ready, login, selectWallet, logout, register, client, identifier, disconnect } = useNFT3()

  useMount(() => {
    const sessionKey = sessionStorage.getItem('sessionKey')
    if (!sessionKey) return
    const wallet = localStorage.getItem('wallet')
    if (wallet) selectWallet(wallet)
  })

  return {
    selectDialog,
    registerDialog,

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
  }
}
const { Provider: UserProvider, createUseContext } = createContext(useUserService)
export const createUserContext = createUseContext

export default UserProvider
