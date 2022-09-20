import { createContext } from 'app/utils/createContext'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { useNFT3 } from '@nft3sdk/did-manager'
import { NFT3Verifier } from '@nft3sdk/client'
import type { SocialRecord } from './types'
import { useTwitter } from './hooks'

const useSocialService = () => {
  const { client } = useNFT3()
  const [socials, setSocials] = useState<SocialRecord[]>([])

  const verifier = useMemo(() => {
    return new NFT3Verifier(client, 'http://t0.onebitdev.com:10002/')
  }, [client])

  const update = useCallback(
    async (identifier?: string) => {
      identifier = identifier || client.did.identifier
      if (!identifier) return
      const items = await client.socialAccount.list(identifier)
      const rows: SocialRecord[] = items.map((item) => ({
        ...item,
        verified: verifier.verifyProof({
          did: identifier || '',
          account: item.account,
          type: item.type,
          proof: item.proof,
          verifier_key: item.verifier_key,
        }),
      }))
      setSocials(rows)
    },
    [client.did.identifier, client.socialAccount, verifier]
  )

  const twitter = useTwitter({ socials, verifier })

  useEffect(() => {
    update()
  }, [update])

  return {
    twitter,
    update,
  }
}
const { Provider: SocialProvider, createUseContext } = createContext(useSocialService)
export const createSocialContext = createUseContext

export default SocialProvider
