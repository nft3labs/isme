import { useCallback, useMemo } from 'react'
import { useNFT3 } from '@nft3sdk/did-manager'
import type { NFT3Verifier, SocialAccountModel } from '@nft3sdk/client'
import type { SocialRecord } from '../types'

type TwitterProps = {
  verifier: NFT3Verifier
  socials: SocialRecord[]
}

export const useTwitter = (props: TwitterProps) => {
  const { verifier, socials } = props
  const { client } = useNFT3()
  const request = useCallback(() => {
    const info = verifier.requestTwitter()
    return info
  }, [verifier])

  const verify = useCallback(
    async (account: string, msghash: string) => {
      const result = await verifier.verifyTwitter(account, msghash)
      return result
    },
    [verifier]
  )

  const add = useCallback(
    async (record: SocialAccountModel) => {
      const accounts = await client.socialAccount.list()
      const item = accounts.find((row) => row.type === 'twitter' && row.account === record.account)
      if (item) throw new Error('Account exists')
      await client.socialAccount.add(record)
    },
    [client.socialAccount]
  )

  const remove = useCallback(
    async (dataId: string) => {
      await client.socialAccount.remove(dataId)
    },
    [client.socialAccount]
  )

  const account = useMemo(() => {
    const record = socials.find((item) => item.type === 'twitter' && item.verified === true)
    return record
  }, [socials])

  return {
    account,
    request,
    verify,
    add,
    remove,
  }
}
