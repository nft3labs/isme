import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import OutlinedInput from '@mui/material/OutlinedInput'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded'
import TwitterIcon from '@mui/icons-material/Twitter'

import { toast } from 'lib/toastify'
import { useNFT3Profile, useUser } from 'domains/data'
import { writeText } from 'app/utils/dom/clipboard'
import { H3, Paragraph } from 'components/Typography'

import ReferralCard from './ReferralCard'
import Invitees from './Invitees'

const ReferralProgram: FC = () => {
  const theme = useTheme()
  const { didname } = useUser()
  const { setDidname } = useNFT3Profile()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!didname) return
    setDidname(didname)
  }, [didname, setDidname])

  const referralLink = 'https://isme.is?inviter=' + (didname?.replace(/\.isme$/, '') || '')

  return (
    <Card
      sx={{
        marginTop: '30px',
        padding: { xs: theme.spacing(2), sm: theme.spacing(4) },
      }}
    >
      <CardContent>
        <Stack spacing={4}>
          <Stack spacing={2} textAlign="center">
            <H3>Refer Friends and Earn Rewards</H3>
            <Paragraph>
              Invite your friends to register for a .isme did via the referral link of your account, and get rewarded
              with NFTs. Referral program rules ↗
            </Paragraph>
          </Stack>

          <ReferralCard />

          <Stack spacing={2}>
            <H3>Referral link</H3>
            <Stack spacing={2} direction="row">
              <OutlinedInput
                id="outlined-adornment-password"
                type="text"
                value={referralLink}
                disabled
                endAdornment={
                  <InputAdornment position="end">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setCopied(true)
                        writeText(referralLink)
                        toast.success('Referral link copied successfully', {
                          position: toast.POSITION.BOTTOM_RIGHT,
                        })
                      }}
                    >
                      {copied ? (
                        <Stack spacing={1} direction="row">
                          <InventoryRoundedIcon fontSize="small" sx={{ color: 'text.primary' }} />
                          <span>Copied</span>
                        </Stack>
                      ) : (
                        <Stack spacing={1} direction="row">
                          <ContentCopyRoundedIcon fontSize="small" sx={{ color: 'text.primary' }} />
                          <span>Copy</span>
                        </Stack>
                      )}
                    </Button>
                  </InputAdornment>
                }
                label="Password"
              />
              <Button
                variant="twitter"
                startIcon={<TwitterIcon />}
                disabled={!didname}
                onClick={() => {
                  const text = `Get your #ISME domain now to earn your $ISME tokens by using the official @NFT3com referral link!

Your true digital self starts right here and now ⬇️`

                  window.open(
                    `https://twitter.com/share?text=${encodeURIComponent(text)}&url=${referralLink}`,
                    `_blank`
                  )
                }}
              >
                Share
              </Button>
            </Stack>
          </Stack>

          <Invitees />
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ReferralProgram
