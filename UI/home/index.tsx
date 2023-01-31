import { styled } from '@mui/material/styles'
import dynamic from 'next/dynamic'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Image from 'next/image'
import BackgroundImage from './images/001-background.png'
import { H1, H2, H3, Tiny } from 'components/Typography'
import FollowGrid from 'components/Follow/FollowGrid'
import { useNFT3FeaturedPeoples, useNFT3Stats, useUser } from 'domains/data'
import { useMemo } from 'react'
import { DisplayNumber } from 'components/Number'

const ROOT = styled(Stack)``
const FollowGridDynamic = dynamic(async () => FollowGrid, { ssr: false })

const Home: FC = () => {
  const { account, selectDialog } = useUser()
  const { featuredPeoples } = useNFT3FeaturedPeoples()
  const followers = useMemo(() => {
    if (!featuredPeoples) return []
    return featuredPeoples.slice(0, 12)
  }, [featuredPeoples])
  const {
    stats: { connections, dids, socials, communitys },
  } = useNFT3Stats()

  return (
    <ROOT spacing={{ xs: 8, sm: 2 }}>
      <Grid container justifyContent="center" alignItems="center" flexDirection={{ xs: 'column-reverse', sm: 'row' }} spacing={4}>
        <Grid item xs={12} sm={6.5}>
          <Stack spacing={6}>
            <Stack spacing={2}>
              <H1>Your Decentralized Identity for Web3</H1>
              <H3 sx={{ color: 'text.secondary' }}>Connect everything in the first unified social identity network</H3>
            </Stack>
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

              <Button variant="outlined" href='/app/referral-program'>Invite Friends</Button>
            </Stack>
            <Grid
              container
              paddingY={3}
              paddingX={2}
              rowGap={2}
              sx={{ 
                border: 'solid 1px', 
                borderColor: 'divider',
                borderRadius: 5,
              }}
            >
              <Grid item xs={6} sm={3}>
                <H2>
                  <DisplayNumber value={dids} />
                </H2>
                <Tiny sx={{ color: 'grey.600' }}>DID Claimed</Tiny>
              </Grid>
              <Grid item xs={6} sm={3}>
                <H2>
                  <DisplayNumber value={socials} />
                </H2>
                <Tiny sx={{ color: 'grey.600' }}>DID Verified</Tiny>
              </Grid>
              <Grid item xs={6} sm={3}>
                <H2>
                  <DisplayNumber value={connections} />
                </H2>
                <Tiny sx={{ color: 'grey.600' }}>Connections</Tiny>
              </Grid>
              <Grid item xs={6} sm={3}>
                <H2>
                  <DisplayNumber value={communitys} />
                </H2>
                <Tiny sx={{ color: 'grey.600' }}>In Communities</Tiny>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={5.5}>
          <Image src={BackgroundImage} alt="background.png" />
        </Grid>
      </Grid>
      <Stack spacing={4}>
        <H2 textAlign="center">Featured People</H2>
        <FollowGridDynamic followers={followers} />
      </Stack>
    </ROOT>
  )
}

export default Home
