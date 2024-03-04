import { useCallback, useEffect, useMemo, useState } from 'react'
import { styled } from '@mui/material/styles'
import Image from 'next/image'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

import { H1, H3, H5, Paragraph } from 'components/Typography'
import { useNFT3ReferrerStats, useUser } from 'domains/data'
import ETHImg from 'public/eth.svg'
import Twitter from 'components/Twitter'
import { DisplayNumber } from 'components/Number'

import TwitterContent from './TwitterContent'
import referralBg from './images/referral-bg.jpg'
import TwitterIcon from '@mui/icons-material/Twitter'
import CheckIcon from '@mui/icons-material/CheckCircle'
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined'
import useMediaQuery from '@mui/material/useMediaQuery'
import { textCenterEllipsis } from 'app/utils/string/text-center-ellipsis'
import { safeGet } from 'app/utils/get'
import { useSocial } from 'domains/data/nft3/social/hooks/useSocial'
import { toast } from 'lib/toastify'

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
  const [bonus, setBonus] = useState(0)
  const [loading, setLoading] = useState(false)
  const { didname, didinfo, identifier } = useUser()
  const {
    referrerStats: { invitees, verified_invitess, reward, claimable_reward },
    request
  } = useNFT3ReferrerStats()

  const accounts = useMemo(
    () =>
      safeGet(() =>
        didinfo.addresses.map((item) => {
          const arr = item.split(':')
          return {
            network: arr[0],
            account: arr[1],
          }
        })
      ) || [],
    [didinfo?.addresses]
  )
  const { twitter, checkBonus, getBonus } = useSocial(identifier)

  const onCheck = useCallback(async () => {
    try {
      if (!twitter?.account?.account) {
        return toast.error('You need to verify your twitter account first.')
      }
      setLoading(true)
      const result = await checkBonus()
      setBonus(result)
      if (result === 0) {
        toast.error('Verify bonus failed.')
      } else {
        toast.success('Verify bonus successful.')
        request()
      }
    } finally {
      setLoading(false)
    }
  }, [checkBonus, request])

  useEffect(() => {
    getBonus().then(result => setBonus(result))
  }, [getBonus])

  return (
    <ROOT>
      <CardContent>
        <Stack spacing={6} padding={1}>
          <Stack spacing={1}>
            <H1 color="white" fontSize={{ xs: 24, sm: 36 }}>
              {didname || 'Please login'}
            </H1>
            {didname &&
              accounts.map(({ account: wallet }) => {
                return (
                  <Stack key={wallet} spacing={1} direction="row">
                    <Image src={ETHImg} alt="ETH" />
                    <Paragraph color="white" fontSize={14}>
                      {textCenterEllipsis(wallet)}
                    </Paragraph>
                  </Stack>
                )
              })}
            <Box>
              <Twitter
                buttonComponent={TwitterContent}
                useData={() => ({
                  isUser: !!didname,
                  twitterAccount: twitter.account.account,
                })}
              />
            </Box>
            <Box>
              {bonus === 0 ? (
                <Button
                  variant="twitter"
                  size="small"
                  sx={{
                    width: { xs: 1, sm: '200px' },
                    borderRadius: '100px',
                    margin: '0 5px',
                  }}
                  startIcon={<TwitterIcon />}
                  onClick={onCheck}
                  disabled={loading}
                >
                  <Box
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Verify Bonus
                  </Box>
                </Button>
              ) : (
                <Button
                  variant="twitter"
                  size="small"
                  sx={{
                    width: { xs: 1, sm: '200px' },
                    borderRadius: '100px',
                    margin: '0 5px',
                  }}
                  startIcon={<CheckIcon />}
                  disabled
                >
                  <Box
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Bonus Verified
                  </Box>
                </Button>
              )}
            </Box>
          </Stack>

          <Stack spacing={2}>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <Stack spacing={2} direction="row" alignItems="center">
                <H3 color="white" fontWeight="bold">
                  <DisplayNumber value={verified_invitess} />
                </H3>
                <H5 color="white" display="flex" alignItems="center">
                  <TwitterIcon sx={{ marginRight: 0.5 }} />
                  Verified Invitees
                </H5>
              </Stack>
              <Stack spacing={2} direction="row" alignItems="center">
                <H3 color="white" fontWeight="bold">
                  <DisplayNumber value={invitees} />
                </H3>
                <H5 color="white" display="flex" alignItems="center">
                  <PeopleOutlineOutlinedIcon sx={{ marginRight: 0.5 }} />
                  Total Invitees
                </H5>
              </Stack>
            </Stack>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <Badge spacing={2} direction="row">
                <H5 color="white">Claimable:</H5>
                <Stack spacing={0.5} direction="row">
                  <H5 color="white">
                    <DisplayNumber value={claimable_reward} />
                  </H5>
                  <H5 color="white">ISME</H5>
                </Stack>
              </Badge>
              <Badge spacing={2} direction="row">
                <H5 color="white">Total Reward:</H5>
                <Stack spacing={0.5} direction="row">
                  <H5 color="white">
                    <DisplayNumber value={reward} />
                  </H5>
                  <H5 color="white">ISME</H5>
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
