import type { ReferrerModel } from '.'
import { format as formatData } from 'date-fns'
import { useRouter } from 'next/router'
import { H5, Span } from 'components/Typography'
import Stack from '@mui/material/Stack'
import { useNFT3Social, useUser } from 'domains/data'
import { useMount } from 'app/hooks/useMount'
import { useCallback, useState } from 'react'
import type { ProfileModel, DIDInfo, WithMeta } from '@nft3sdk/client'
import { getProfile } from 'domains/data/nft3/profile/adapter'

const Inviter: FC<{ inviter: ReferrerModel }> = ({ inviter: { createdAt, __owner } }) => {
  const router = useRouter()
  const { verifier } = useNFT3Social()

  const formatDid = (did: string) => {
    if (!did) return undefined
    const arr = did.split(':')
    return arr[arr.length - 1] + '.isme'
  }

  const goToProfileBoard = (name: string) => router.push(`/` + name)
  const { client } = useUser()
  const identifier = __owner
  const [twitter, setTwitter] = useState<any>()
  const [profile, setProfile] = useState<WithMeta<ProfileModel>>({} as any)
  const [didinfo, setDidinfo] = useState<DIDInfo>()

  const updateProfile = useCallback(() => {
    if (!identifier) return
    return client.profile.info(identifier).then((profile) => {
      if (!profile) return
      setProfile(getProfile(profile) as any)
    })
  }, [client.profile, identifier])

  const updateDidInfo = useCallback(() => {
    if (!identifier) return
    return client.did.info(identifier).then((didinfo) => {
      setDidinfo(didinfo)
    })
  }, [client.did, identifier])

  const updateTwitter = useCallback(async () => {
    const items = await client.socialAccount.list(identifier)
    const socials = items.map((item) => ({
      ...item,
      verified: verifier.verifyProof({
        did: identifier || '',
        account: item.account,
        type: item.type,
        proof: item.proof,
        verifier_key: item.verifier_key,
      }),
    }))
    const twitter = socials.find((item) => item.type === 'twitter' && item.verified === true)

    if (twitter) setTwitter(twitter)
  }, [client.socialAccount, identifier, verifier])

  useMount(async () => {
    updateProfile()
    updateDidInfo()
    updateTwitter()
  })

  return (
    <Stack direction="row" justifyContent="space-between" padding={2} alignItems="center">
      <Stack spacing={0.5}>
        <H5
          fontWeight="medium"
          sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
          onClick={() => goToProfileBoard(formatDid(__owner))}
        >
          {formatDid(__owner)}
        </H5>
        <Span color="text.disabled">{JSON.stringify(profile)}</Span>
        <Span color="text.disabled">{JSON.stringify(didinfo)}</Span>
        <Span color="text.disabled">{JSON.stringify(twitter)}</Span>
      </Stack>
      <Span color="text.disabled">Joined {formatData(createdAt * 1000 || 0, 'dd MMM yyyy hh:mm')}</Span>
    </Stack>
  )
}

export default Inviter
