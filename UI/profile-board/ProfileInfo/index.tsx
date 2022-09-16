import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { Paragraph } from 'components/Typography'
import { useProfileBoard, useUser } from 'domains/data'

const ROOT = styled(Card)``

const ProfileInfo: FC = () => {
  const { didname, selectDialog } = useUser()
  const { ready, profile, format, follow } = useProfileBoard()
  if (!ready || !profile) return null
  const { followed, count, followDID, unfollowDID } = follow
  return (
    <ROOT>
      <CardContent>
        <Stack spacing={2}>
          <Avatar alt={profile.name} src={format(profile.avatar)} />
          <Paragraph>{profile.name}</Paragraph>
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
      </CardContent>
      <CardActions>
        {!followed ? (
          <Button
            size="small"
            onClick={() => {
              if (!didname) return selectDialog.open()
              followDID()
            }}
          >
            Follow
          </Button>
        ) : (
          <Button size="small" onClick={() => unfollowDID()}>
            Unfollow
          </Button>
        )}
        {didname === profile.name && <Button size="small">Edit Profile</Button>}
      </CardActions>
    </ROOT>
  )
}

export default ProfileInfo
