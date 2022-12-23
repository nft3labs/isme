import { styled } from '@mui/material/styles'
import Image from 'next/image'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import { H1, H3, H5, Paragraph } from 'components/Typography'
import { useNFT3ReferrerStats, useNFT3Wallet, useUser } from 'domains/data'
import ETHImg from 'public/eth.svg'
import Twitter from 'components/Twitter'
import { DisplayNumber } from 'components/Number'

import TwitterContent from './TwitterContent'
import referralBg from './images/referral-bg.jpg'
import TwitterIcon from '@mui/icons-material/Twitter'
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined'
import useMediaQuery from '@mui/material/useMediaQuery'
import { textCenterEllipsis } from 'app/utils/string/text-center-ellipsis'

const ROOT = styled(Card)(({ theme }) => {
  const matches = useMediaQuery(theme.breakpoints.up('sm'))
  return {
    backgroundImage: `url(${referralBg.src})`,
    backgroundRepeat: matches ? 'round' : 'unset',
    height: matches ? '368px' : 'auto',
  }
})

const Badge = styled(Stack)(() => ({
  backgroundColor: 'rgba(255, 255, 255, 0.3)', 
  borderRadius: 100, 
  padding: '10px 15px',
}))

const ReferralCard: FC = () => {
  const { didname } = useUser()
  const { accounts } = useNFT3Wallet()
  const {
    referrerStats: { invitees, verified_invitess, reward, claimable_reward },
  } = useNFT3ReferrerStats()
  return (
    <ROOT>
      <CardContent >
        <Stack spacing={12} padding={1}>
          <Stack spacing={1}>
            <H1 color='white' fontSize={{ xs: 24, sm: 36 }}>{didname || 'Please login'}</H1>
            {didname && accounts.map(({ account: wallet }) => {
              return (
                <Stack key={wallet} spacing={1} direction="row">
                  <Image src={ETHImg} alt="ETH" />
                  <Paragraph color='white' fontSize={14}>{textCenterEllipsis(wallet)}</Paragraph>
                </Stack>
              )
            })}
            <Box>
              <Twitter buttonComponent={TwitterContent} />
            </Box>
          </Stack>

          <Stack spacing={2}>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <Stack spacing={2} direction="row" alignItems='center'>
                <H3 color='white' fontWeight='bold'>
                  <DisplayNumber value={verified_invitess} />
                </H3>
                <H5 color='white' display='flex' alignItems='center'><TwitterIcon sx={{ marginRight: 0.5 }}/>Verified Invitees</H5>
              </Stack>
              <Stack spacing={2} direction="row" alignItems='center'>
                <H3 color='white' fontWeight='bold'>
                  <DisplayNumber value={invitees} />
                </H3>
                <H5 color='white' display='flex' alignItems='center'><PeopleOutlineOutlinedIcon sx={{ marginRight: 0.5 }}/>Total Invitees</H5>
              </Stack>
            </Stack>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <Badge spacing={2} direction="row">
                <H5 color='white'>Claimable:</H5>
                <Stack spacing={0.5} direction="row">
                  <H5 color='white'>
                    <DisplayNumber value={claimable_reward} />
                  </H5>
                  <H5 color='white'>ISME</H5>
                </Stack>
              </Badge>
              <Badge spacing={2} direction="row">
                <H5 color='white'>Total Reward:</H5>
                <Stack spacing={0.5} direction="row">
                  <H5 color='white'>
                    <DisplayNumber value={reward} />
                  </H5>
                  <H5 color='white'>ISME</H5>
                </Stack>
              </Badge>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </ROOT>
  )
}

export default ReferralCard
