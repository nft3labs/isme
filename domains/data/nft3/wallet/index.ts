import { createContext } from 'app/utils/createContext'
import { useState, useEffect, useCallback } from 'react'
import { useNFT3Profile, useUser } from 'domains/data'
import { useNFT3 } from '@nft3sdk/did-manager'
import { safeGet } from 'app/utils/get'

import type { AccountRecord } from './types'

const useWalletService = () => {
  const { client } = useNFT3()
  const { account } = useUser()
  const { isUser, didinfo } = useNFT3Profile()
  const [value, setValue] = useState('')
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

  useEffect(() => {
    setValue(isUser ? account : safeGet(() => accounts[0].account) || '')
  }, [account, accounts, isUser])

  return {
    account: value,
    setAccount: setValue,
    accounts,
    update,
    add,
    remove,
  }
}
const { Provider: WalletProvider, createUseContext } = createContext(useWalletService)
export const createWalletContext = createUseContext

export default WalletProvider
