import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { useNFT3, useNFT3Profile, useUser } from 'domains/data'
import { Paragraph } from 'components/Typography'
import FlexRowAlign from 'components/flexbox/FlexRowAlign'

import Twitter from './Twitter'
import { useMount } from 'app/hooks/useMount'

const ROOT = styled(Stack)``

const Profile: FC = () => {
  const { ready, profile, setDidname } = useNFT3Profile()
  const { identifier } = useUser()
  useMount(() => {
    setDidname(identifier)
  })
  const { format } = useNFT3()
  if (!ready) return null
  return (
    <ROOT spacing={2}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <FlexRowAlign>
              <Stack spacing={2}>
                <FlexRowAlign>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <IconButton color="primary" aria-label="upload picture" component="label">
                        <input hidden accept="image/*" type="file" />
                        <PhotoCamera />
                      </IconButton>
                    }
                  >
                    <Avatar alt={profile.name} src={format(profile.avatar)} />
                  </Badge>
                </FlexRowAlign>
                <Paragraph>{profile.name}</Paragraph>
                <Paragraph>Joined Jul 2022</Paragraph>
              </Stack>
            </FlexRowAlign>

            <Stack spacing={2}>
              <Paragraph>Connected wallets</Paragraph>
            </Stack>
            <Stack spacing={2}>
              <Paragraph>Twitter</Paragraph>
              <Twitter />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </ROOT>
  )
}

export default Profile
