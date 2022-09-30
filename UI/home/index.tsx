import { styled } from '@mui/material/styles'
import dynamic from 'next/dynamic'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Image from 'next/image'
import BackgroundImage from './images/001-background.png'
import { H1, H2, H3 } from 'components/Typography'
import FollowGrid from 'components/Follow/FollowGrid'
import type { FollowMember } from 'components/Follow/types'
import { DEFAULT_AVATARS, getFilePath } from 'app/constant'
import { useUser } from 'domains/data'
// import { DisplayNumber } from 'components/Number'

const FEATURED_PEOPLES: FollowMember[] = [
  {
    identifier: 'did:nft3:nakamoto',
    name: 'nakamoto',
    avatar: getFilePath(DEFAULT_AVATARS[0]),
    bio: '',
  },
  {
    identifier: 'did:nft3:Eric',
    name: 'Eric',
    avatar: getFilePath(DEFAULT_AVATARS[1]),
    bio: '',
  },
  {
    identifier: 'did:nft3:Nathan',
    name: 'Nathan',
    avatar: getFilePath(DEFAULT_AVATARS[2]),
    bio: '',
  },
  {
    identifier: 'did:nft3:Harper',
    name: 'Harper',
    avatar: getFilePath(DEFAULT_AVATARS[3]),
    bio: '',
  },
  {
    identifier: 'did:nft3:Costa',
    name: 'Costa',
    avatar: getFilePath(DEFAULT_AVATARS[4]),
    bio: '',
  },
  {
    identifier: 'did:nft3:Jacapo',
    name: 'Jacapo',
    avatar: getFilePath(DEFAULT_AVATARS[5]),
    bio: '',
  },
  {
    identifier: 'did:nft3:Zoe',
    name: 'Zoe',
    avatar: getFilePath(DEFAULT_AVATARS[6]),
    bio: '',
  },
  {
    identifier: 'did:nft3:Fox',
    name: 'Fox',
    avatar: getFilePath(DEFAULT_AVATARS[7]),
    bio: '',
  },
  {
    identifier: 'did:nft3:Anya',
    name: 'Anya',
    avatar: getFilePath(DEFAULT_AVATARS[8]),
    bio: '',
  },
  {
    identifier: 'did:nft3:Sterling',
    name: 'Sterling',
    avatar: getFilePath(DEFAULT_AVATARS[0]),
    bio: '',
  },
  {
    identifier: 'did:nft3:John',
    name: 'John',
    avatar: getFilePath(DEFAULT_AVATARS[1]),
    bio: '',
  },
  {
    identifier: 'did:nft3:Jones',
    name: 'Jones',
    avatar: getFilePath(DEFAULT_AVATARS[2]),
    bio: '',
  },
]
const ROOT = styled(Stack)``
const FollowGridDynamic = dynamic(async () => FollowGrid, { ssr: false })

const Home: FC = () => {
  const { account, selectDialog } = useUser()
  return (
    <ROOT spacing={{ xs: 8, sm: 2 }}>
      <Grid container justifyContent="center" alignItems="center" flexDirection={{ xs: 'column-reverse', sm: 'row' }}>
        <Grid item xs={12} sm={5}>
          <Stack spacing={4}>
            <Stack spacing={2}>
              <H1>Your Decentralized Identity for Web 3.0</H1>
              <H3 sx={{ color: 'text.secondary' }}>Connect everything in the first unified social idendity network</H3>
            </Stack>
            {/* <Stack spacing={4} direction="row">
              <Stack spacing={2}>
                <H2>
                  <DisplayNumber value={1234123} />
                </H2>
                <Span sx={{ color: 'grey.400' }}>Total Users</Span>
              </Stack>
              <Stack spacing={2}>
                <H2>12M</H2>
                <Span sx={{ color: 'grey.400' }}>Total Connections</Span>
              </Stack>
            </Stack> */}
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              {!account ? (
                <Button
                  variant="gradient"
                  onClick={() => {
                    selectDialog.open()
                  }}
                  size="large"
                >
                  Create Now
                </Button>
              ) : (
                <Button variant="gradient" disabled>
                  DID Created
                </Button>
              )}

              {/* <Button> Search Address</Button> */}
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={12} sm={6}>
          <Image src={BackgroundImage} alt="background.png" />
        </Grid>
      </Grid>
      <Stack spacing={4}>
        <H2 textAlign="center">Featured People</H2>
        <FollowGridDynamic followers={FEATURED_PEOPLES} />
      </Stack>
    </ROOT>
  )
}

export default Home
