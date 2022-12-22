import { styled } from '@mui/material/styles'
import Image from 'next/image'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import { H3, Paragraph } from 'components/Typography'
import { useNFT3ReferrerStats, useNFT3Wallet, useUser } from 'domains/data'
import ETHImg from 'public/eth.svg'
import Twitter from 'components/Twitter'
import { DisplayNumber } from 'components/Number'

import TwitterContent from './TwitterContent'

const ROOT = styled(Card)``

const ReferralCard: FC = () => {
  const { didname } = useUser()
  const { accounts } = useNFT3Wallet()
  const {
    referrerStats: { invitees, verified_invitess, reward, claimable_reward },
  } = useNFT3ReferrerStats()
  return (
    <ROOT>
      <CardContent>
        <Stack spacing={10}>
          <Stack spacing={2}>
            <H3>{didname}</H3>
            {accounts.map(({ account: wallet }) => {
              return (
                <Stack key={wallet} spacing={1} direction="row">
                  <Image src={ETHImg} alt="ETH" />
                  <Paragraph>{wallet}</Paragraph>
                </Stack>
              )
            })}
            <Box>
              <Twitter buttonComponent={TwitterContent} />
            </Box>
          </Stack>

          <Stack spacing={2}>
            <Stack spacing={4} direction="row">
              <Stack spacing={2} direction="row">
                <Paragraph>
                  <DisplayNumber value={verified_invitess} />
                </Paragraph>
                <Paragraph>Verified Invitees</Paragraph>
              </Stack>
              <Stack spacing={2} direction="row">
                <Paragraph>
                  <DisplayNumber value={invitees} />
                </Paragraph>
                <Paragraph>Total Invitees</Paragraph>
              </Stack>
            </Stack>
            <Stack spacing={2} direction="row">
              <Button>
                <Stack spacing={2} direction="row">
                  <Paragraph>Claimable:</Paragraph>
                  <Stack spacing={0.5} direction="row">
                    <Paragraph>
                      <DisplayNumber value={claimable_reward} />
                    </Paragraph>
                    <Paragraph>ISME</Paragraph>
                  </Stack>
                </Stack>
              </Button>
              <Button>
                <Stack spacing={2} direction="row">
                  <Paragraph>Total Reward:</Paragraph>
                  <Stack spacing={0.5} direction="row">
                    <Paragraph>
                      <DisplayNumber value={reward} />
                    </Paragraph>
                    <Paragraph>ISME</Paragraph>
                  </Stack>
                </Stack>
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </ROOT>
  )
}

export default ReferralCard
