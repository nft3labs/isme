import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Image from 'next/image'
import BackgroundImage from './images/001-background.png'
import { H1, H2, Paragraph } from 'components/Typography'

const ROOT = styled(Stack)``

const Home: FC = () => {
  return (
    <ROOT spacing={2}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={6}>
          <Stack spacing={2}>
            <H1>Your Decentralized Identity for Web 3.0</H1>
            <H2>Connect everything in the first unified social idendity network</H2>
            <Stack spacing={2} direction="row">
              <Stack spacing={2}>
                <Paragraph>1234123</Paragraph>
                <Paragraph>Total Users</Paragraph>
              </Stack>
              <Stack spacing={2}>
                <Paragraph>12M</Paragraph>
                <Paragraph>Total Connections</Paragraph>
              </Stack>
            </Stack>
            <Stack spacing={2} direction="row">
              <Button> Create Now</Button>
              <Button> Search Address</Button>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Image src={BackgroundImage} alt="background.png" />
        </Grid>
      </Grid>
      <Box>
        <H2 textAlign="center">Featured People</H2>
      </Box>
    </ROOT>
  )
}

export default Home
