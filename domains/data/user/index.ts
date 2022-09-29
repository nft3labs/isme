import { useNFT3 } from '@nft3sdk/did-manager'
import { useDialog } from 'app/hooks/useDialog'
import { createContext } from 'app/utils/createContext'

const useUserService = () => {
  const selectDialog = useDialog()
  const registerDialog = useDialog()
  const { account, didname, ready, login, selectWallet, logout, register, client, identifier, disconnect } = useNFT3()

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
