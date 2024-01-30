import type { ReferrerModel } from '.'
import { format as formatData } from 'date-fns'
import { useRouter } from 'next/router'
import { H5, Span } from 'components/Typography'
import Stack from '@mui/material/Stack'
import { useNFT3Social, useUser, useNFT3 } from 'domains/data'
import { useMount } from 'app/hooks/useMount'
import { useCallback, useState } from 'react'
import type { ProfileModel, WithMeta } from '@rootlabs/client'
import { getProfile } from 'domains/data/nft3/profile/adapter'
import Avatar from '@mui/material/Avatar'

const Invitee: FC<{ inviter: ReferrerModel }> = ({ inviter: { createdAt, __owner } }) => {
  const router = useRouter()
  const { verifier } = useNFT3Social()
  const { format } = useNFT3()

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

  const updateProfile = useCallback(() => {
    if (!identifier) return
    return client.profile.info(identifier).then((profile) => {
      if (!profile) return
      setProfile(getProfile(profile) as any)
    })
  }, [client.profile, identifier])

  const updateDidInfo = useCallback(() => {
    if (!identifier) return
  }, [identifier])

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
      <Stack
        spacing={2}
        direction="row"
        alignItems='center'
        sx={{
          flex: 1,
        }}
      >
        <Avatar
          alt={profile.name}
          sx={{ width: 48, height: 48, cursor: 'pointer' }}
          src={format(profile.avatar)}
          onClick={() => goToProfileBoard(formatDid(__owner))}
        />
        <Stack spacing={1}>
          <H5
            fontWeight="medium"
            sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
            onClick={() => goToProfileBoard(formatDid(__owner))}
          >
            {formatDid(__owner)}
          </H5>
          <Span color="text.disabled">Joined {formatData(createdAt * 1000 || 0, 'dd MMM yyyy hh:mm')}</Span>
        </Stack>
      </Stack>
      {twitter ? <Span color="success.main">Twitter verified</Span> : <Span color="text.disabled">Twitter unverified</Span>}
    </Stack>
  )
}

export default Invitee
