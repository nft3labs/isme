import { useROOT } from '@rootlabs/did-manager'
import { ROOTVerifier } from '@rootlabs/client'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { useTwitter } from '.'
import type { SocialRecord } from '../types'

export const useSocial = (did: string) => {
  const { client } = useROOT()
  const [socials, setSocials] = useState<SocialRecord[]>([])

  const verifier = useMemo(() => {
    return new ROOTVerifier(client, 'https://t0.onebitdev.com/nft3-verifier/')
  }, [client])

  const update = useCallback(
    async (identifier?: string) => {
      identifier = identifier || did
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
    [client.socialAccount, did, verifier]
  )

  const twitter = useTwitter({ socials, verifier })

  useEffect(() => {
    update()
  }, [update])

  return {
    verifier,
    twitter,
    update,
  }
}
