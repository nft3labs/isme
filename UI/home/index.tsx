import { styled } from '@mui/material/styles'
import dynamic from 'next/dynamic'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Image from 'next/image'
import BackgroundImage from './images/001-background.png'
import { H1, H2, H3 } from 'components/Typography'
import FollowGrid from 'components/Follow/FollowGrid'
import { useNFT3FeaturedPeoples, useUser } from 'domains/data'
import { useMemo } from 'react'

const ROOT = styled(Stack)``
const FollowGridDynamic = dynamic(async () => FollowGrid, { ssr: false })

const Home: FC = () => {
  const { account, selectDialog } = useUser()
  const { featuredPeoples } = useNFT3FeaturedPeoples()
  const followers = useMemo(() => {
    if (!featuredPeoples) return []
    return featuredPeoples.slice(0, 12)
  }, [featuredPeoples])

  return (
    <ROOT spacing={{ xs: 8, sm: 2 }}>
      <Grid container justifyContent="center" alignItems="center" flexDirection={{ xs: 'column-reverse', sm: 'row' }}>
        <Grid item xs={12} sm={5}>
          <Stack spacing={4}>
            <Stack spacing={2}>
              <H1>Your Decentralized Identity for Web 3.0</H1>
              <H3 sx={{ color: 'text.secondary' }}>Connect everything in the first unified social identity network</H3>
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
        <FollowGridDynamic followers={followers} />
      </Stack>
    </ROOT>
  )
}

export default Home
