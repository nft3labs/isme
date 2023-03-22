import { useRouter } from 'next/router'
import { useMemo } from 'react'
import Head from 'next/head'
import { format as formatData } from 'date-fns'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { H2, H3, Paragraph } from 'components/Typography'
import Twitter from 'components/Twitter'
import FlexBetween from 'components/flexbox/FlexBetween'
import { DisplayNumber } from 'components/Number'
import Unfollow from 'components/Follow/Unfollow'
import ClaimButton from 'components/btn/ClaimButton'
import { useNFT3, useNFT3Follow, useNFT3Profile, useNFT3Wallet, useUser } from 'domains/data'

import TwitterContent from './Twitter/TwitterContent'
import Wallets from './Wallets'
import IconButton from './IconButton'
import circleLinkIcon from './images/circle-link.svg'
import etherscanIcon from './images/etherscan.svg'
import looksrareIcon from './images/looksrare.svg'
import openseaIcon from './images/opensea.svg'
import messageIcon from './images/message.svg'
import { ImageButton } from '../../../components/btn/IconButton'

const ROOT = styled(Card)``

const ProfileInfo: FC = () => {
  const router = useRouter()
  const { didname, selectDialog } = useUser()
  const { account, current } = useNFT3Wallet()
  const { ready, profile, isUser, needClaim } = useNFT3Profile()
  const NFT3Follow = useNFT3Follow()
  const { format } = useNFT3()
  const { followed, count, follow, unfollow } = NFT3Follow
  const followContent = useMemo(
    () => (
      <>
        {!followed ? (
          <Button
            fullWidth
            variant="gradient"
            size="large"
            onClick={() => {
              if (!didname) return selectDialog.open()
              follow()
            }}
          >
            Follow
          </Button>
        ) : (
          <Unfollow onClick={() => unfollow()} fullWidth size="large" />
        )}

        <ImageButton src={messageIcon} title="Send Message" />
      </>
    ),
    [didname, follow, followed, selectDialog, unfollow]
  )
  if (!ready || !profile) return null
  return (
    <ROOT sx={{ paddingX: 2, paddingY: 4 }}>
      <Head>
        <title>{profile.name}.isme | ISME</title>
        <meta name="description" content={profile.bio || 'ISME is your decentralized identity (DID) for Web3'} />
        <meta key="og:site_name" property="og:site_name" content={`${profile.name}.isme | ISME`} />
        <meta key="og:image" property="og:image" content={profile.avatar || 'https://isme.is/logo-isme.jpg'} />
        <meta
          key="og:description"
          content={profile.bio || 'Connect everything in the first unified social identity network'}
        />
        <meta key="og:title" property="og:title" content={`${profile.name}.isme | ISME`} />
        <meta key="og:url" property="og:url" content={`https://isme.is/${profile.name}`} />

        <meta key="twitter:title" name="twitter:title" content={`${profile.name}.isme | ISME`} />
      </Head>
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={1.5} alignItems="center">
            <Avatar
              alt={profile.name}
              src={format(profile.avatar)}
              sx={{
                width: 100,
                height: 100,
                borderRadius: '30px',
              }}
            />
            <H2>{`${profile.name}.isme`}</H2>
            <Stack spacing={0} direction="row" alignItems="center">
              <Wallets />
              <Paragraph sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                Joined {formatData(profile.createdAt * 1000 || 0, 'MMM yyyy')}
              </Paragraph>
            </Stack>
            <Paragraph
              width="100%"
              sx={{
                color: 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                textAlign: 'center',
              }}
            >
              {profile.bio}
            </Paragraph>
          </Stack>
          <Stack spacing={0} direction="row" alignItems="center" justifyContent="center">
            <Twitter buttonComponent={TwitterContent} />
            <IconButton url={profile.url} alt="url" icon={circleLinkIcon} />
            {current?.network === 'ethereum' && (
              <IconButton url={current.explorer} alt="etherscan" icon={etherscanIcon} />
            )}
            {current?.network === 'solana' && <IconButton url={current.explorer} alt="etherscan" icon={current.icon} />}
            <IconButton url={`https://opensea.io/${account}`} alt="opensea" icon={openseaIcon} />
            <IconButton url={`https://looksrare.org/accounts/${account}`} alt="looksrare" icon={looksrareIcon} />
          </Stack>
          <FlexBetween>
            <Stack spacing={2} flex="1" textAlign="center">
              <H3 fontWeight={700}>
                <DisplayNumber value={count.following} />
              </H3>
              <Paragraph sx={{ color: 'text.secondary' }}>Following</Paragraph>
            </Stack>
            <Divider orientation="vertical" sx={{ height: 30 }} />
            <Stack spacing={2} flex="1" textAlign="center">
              <H3 fontWeight={700}>
                <DisplayNumber value={count.followers} />
              </H3>
              <Paragraph sx={{ color: 'text.secondary' }}>Followers</Paragraph>
            </Stack>
          </FlexBetween>
        </Stack>
      </CardContent>
      <CardActions>
        {isUser ? (
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => {
              router.push('/app/edit-profile')
            }}
          >
            Edit Profile
          </Button>
        ) : needClaim ? (
          <ClaimButton
            didname={didname}
            buttonProps={{
              size: 'large',
              fullWidth: true,
            }}
          />
        ) : (
          followContent
        )}
      </CardActions>
    </ROOT>
  )
}

export default ProfileInfo
