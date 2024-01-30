import { useCallback, useMemo } from 'react'
import { useROOT } from '@rootlabs/did-manager'
import type { ROOTVerifier, SocialAccountModel } from '@rootlabs/client'
import type { SocialRecord } from '../types'

type TwitterProps = {
  verifier: ROOTVerifier
  socials: SocialRecord[]
}

export const useTwitter = (props: TwitterProps) => {
  const { verifier, socials } = props
  const { client } = useROOT()
  const request = useCallback(() => {
    const info = verifier.requestTwitter()
    return info
  }, [verifier])

  const verify = useCallback(
    async (account: string, msghash: string, link: string) => {
      const regex = /^https?:\/\/(twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/
      if (regex.test(link) !== true) {
        throw new Error('Invalid tweet link')
      }
      const result = await verifier.verifyTwitter(account, msghash, link)
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
    return record || ({} as undefined)
  }, [socials])

  return {
    account,
    request,
    verify,
    add,
    remove,
  }
}
