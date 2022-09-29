import { createContext } from 'app/utils/createContext'
import { useState, useEffect, useCallback } from 'react'
import { useNFT3Profile } from 'domains/data'
import { useNFT3 } from '@nft3sdk/did-manager'

import type { AccountRecord } from './types'

const useWalletService = () => {
  const { client } = useNFT3()
  const { didinfo } = useNFT3Profile()
  const [accounts, setAccounts] = useState<AccountRecord[]>([])

  const update = useCallback(async () => {
    if (!didinfo || !didinfo.addresses) return
    const accounts = didinfo.addresses.map((item) => {
      const arr = item.split(':')
      return {
        network: arr[0],
        account: arr[1],
      }
    })
    setAccounts(accounts)
  }, [didinfo])

  const add = useCallback(async () => {
    await client.did.addKey()
    update()
  }, [client.did, update])

  const remove = useCallback(async () => {
    await client.did.removeKey()
    update()
  }, [client.did, update])

  useEffect(() => {
    update()
  }, [update])

  return {
    accounts,
    update,
    add,
    remove,
  }
}
const { Provider: WalletProvider, createUseContext } = createContext(useWalletService)
export const createWalletContext = createUseContext

export default WalletProvider
