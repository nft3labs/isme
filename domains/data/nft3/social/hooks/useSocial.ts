import { useROOT } from '@rootlabs/did-manager'
import { ROOTVerifier } from '@rootlabs/client'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { useTwitter } from '.'
import { useUser } from 'domains/data'
import type { SocialRecord } from '../types'

export const useSocial = (did: string) => {
  const { client } = useROOT()
  const { didname } = useUser()
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

  const getBonus = useCallback(async () => {
    if (!did) return 0
    const host = `https://t0.onebitdev.com`
    const resp = await fetch(`${host}/nft3-queryer/api/task/status?did=${did}&topic=verifyBonus`)
    const result = await resp.json()
    return result?.data?.reward || 0
  }, [did])

  const checkBonus = useCallback(async () => {
    if (!did) return 0
    const host = `https://t0.onebitdev.com`
    const resp = await fetch(`${host}/nft3-queryer/api/task/status?did=${did}&topic=verifyBonus`)
    const result = await resp.json()
    if (result?.data?.reward === 0) {
      const resp = await fetch(
        `${host}/nft3-verifier/requestVerify/twitterBio?did=${did}&account=${twitter.account.account}&bio=${didname}`
      )
      const json = await resp.json()
      if (json.result === 'ok' && json.data.result === true) {
        const resp = await fetch(`${host}/nft3-queryer/api/task/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            did,
            topic: 'verifyBonus',
            proof: json.data,
          }),
        })
        const result = await resp.json()
        return result?.data?.reward || 0
      }
    }
    return result.data.reward || 0
  }, [twitter.account, did, didname])

  useEffect(() => {
    update()
  }, [update])

  return {
    verifier,
    twitter,
    update,
    getBonus,
    checkBonus,
  }
}
