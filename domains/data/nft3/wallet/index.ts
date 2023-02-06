import { createContext } from 'app/utils/createContext'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNFT3Profile, useUser } from 'domains/data'
import { useNFT3 } from '@nft3sdk/did-manager'
import { safeGet } from 'app/utils/get'
import ETHImg from 'public/eth.svg'
import SolanaImg from 'public/solana.svg'

import type { AccountRecord } from './types'

const useWalletService = () => {
  const { client } = useNFT3()
  const { account } = useUser()
  const { isUser, didinfo, didname, updateDidInfo } = useNFT3Profile()
  const [value, setValue] = useState('')
  const [accounts, setAccounts] = useState<AccountRecord[]>([])

  const update = useCallback(async () => {
    if (!didinfo || !didinfo.addresses) return
    const accounts = didinfo.addresses.map((item) => {
      const arr = item.split(':')
      const network = arr[0]
      const account = arr[1]
      let icon = ETHImg
      let explorer = `https://etherscan.io/address/${account}`
      switch (network) {
        case 'solana':
          explorer = `https://explorer.solana.com/address/${account}`
          icon = SolanaImg
      }
      return {
        network,
        account,
        icon,
        explorer
      }
    })
    setAccounts(accounts)
  }, [didinfo])

  const add = useCallback(async () => {
    await client.did.addKey()
    updateDidInfo()
  }, [client.did, updateDidInfo])

  const remove = useCallback(async () => {
    await client.did.removeKey()
    updateDidInfo()
  }, [client.did, updateDidInfo])

  const current = useMemo(() => {
    return accounts.find(item => item.account === value)
  }, [value, accounts])

  useEffect(() => {
    update()
  }, [update])

  useEffect(() => {
    setValue(isUser ? account : safeGet(() => accounts[0].account) || '')
  }, [account, accounts, didname, isUser])

  const userHadAddress = useCallback(
    (address: string) => {
      return !!accounts.find(({ account }) => account.toLocaleLowerCase() === address.toLocaleLowerCase())
    },
    [accounts]
  )

  return {
    current,
    account: value,
    setAccount: setValue,
    accounts,
    update,
    add,
    remove,

    userHadAddress,
  }
}
const { Provider: WalletProvider, createUseContext } = createContext(useWalletService)
export const createWalletContext = createUseContext

export default WalletProvider
