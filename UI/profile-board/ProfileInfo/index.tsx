import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { format as formatData } from 'date-fns'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { Paragraph, H2 } from 'components/Typography'
import TwitterButton from 'components/btn/TwitterButton'
import { useNFT3Follow, useNFT3Profile, useNFT3, useUser, useNFT3Social, useNFT3Wallet } from 'domains/data'

import Wallets from './Wallets'
import IconButton from './IconButton'
import circleLinkIcon from './images/circle-link.svg'
import etherscanIcon from './images/etherscan.svg'
import looksrareIcon from './images/looksrare.svg'
import openseaIcon from './images/opensea.svg'

const ROOT = styled(Card)``

const ProfileInfo: FC = () => {
  const router = useRouter()
  const { didname, selectDialog } = useUser()
  const { account } = useNFT3Wallet()
  const { ready, profile, isUser } = useNFT3Profile()
  const NFT3Follow = useNFT3Follow()
  const { twitter } = useNFT3Social()
  const { format } = useNFT3()
  const { followed, count, follow, unfollow } = NFT3Follow
  const followContent = useMemo(
    () =>
      !followed ? (
        <Button
          size="small"
          onClick={() => {
            if (!didname) return selectDialog.open()
            follow()
          }}
        >
          Follow
        </Button>
      ) : (
        <Button size="small" onClick={() => unfollow()}>
          Unfollow
        </Button>
      ),
    [didname, follow, followed, selectDialog, unfollow]
  )
  if (!ready || !profile) return null
  return (
    <ROOT>
      <CardContent>
        <Stack spacing={2}>
          <Stack spacing={1} alignItems="center">
            <Avatar
              alt={profile.name}
              src={format(profile.avatar)}
              sx={{
                width: 100,
                height: 100,
                borderRadius: '30px',
              }}
            />
            <H2 color="#000">{`${profile.name}.isme`}</H2>
            <Stack spacing={0} direction="row" alignItems="center">
              <Wallets />
              <Paragraph color="#BBBBBB">Joined {formatData(profile.createdAt * 1000 || 0, 'MM yyyy')}</Paragraph>
            </Stack>
            <Paragraph
              color="#BBBBBB"
              width="100%"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                '-webkit-line-clamp': '2',
                '-webkit-box-orient': 'vertical',
              }}
            >
              {profile.bio}
            </Paragraph>
          </Stack>
          <Stack spacing={0} direction="row" alignItems="center" justifyContent="center">
            <TwitterButton account={twitter.account?.account} />
            <IconButton url={profile.url} alt="url" icon={circleLinkIcon} />
            <IconButton url={`https://etherscan.io/address/${account}`} alt="etherscan" icon={etherscanIcon} />
            <IconButton url={`https://opensea.io/${account}`} alt="opensea" icon={openseaIcon} />
            <IconButton url={`https://looksrare.org/accounts/${account}`} alt="looksrare" icon={looksrareIcon} />
          </Stack>
          <Stack spacing={2} direction="row">
            <Stack spacing={2}>
              <Paragraph>{count.following}</Paragraph>
              <Paragraph>Following</Paragraph>
            </Stack>
            <Stack spacing={2}>
              <Paragraph>{count.followers}</Paragraph>
              <Paragraph>Follows</Paragraph>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
      <CardActions>
        {isUser ? (
          <Button
            size="small"
            onClick={() => {
              router.push('/profile')
            }}
          >
            Edit Profile
          </Button>
        ) : (
          followContent
        )}
      </CardActions>
    </ROOT>
  )
}

export default ProfileInfo
