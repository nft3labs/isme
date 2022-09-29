import { useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { format as formatData } from 'date-fns'

import { useNFT3, useNFT3Profile, useUser } from 'domains/data'
import { Paragraph } from 'components/Typography'
import FlexRowAlign from 'components/flexbox/FlexRowAlign'

import Twitter from './Twitter'
import Wallets from './Wallets'
import SubmitBotton from 'components/form/SubmitBotton'
import { useForm } from './useForm'

const ROOT = styled('form')``

const Profile: FC = () => {
  const { ready, profile, setDidname } = useNFT3Profile()
  const { identifier } = useUser()

  useEffect(() => {
    setDidname(identifier)
  }, [identifier, setDidname])

  const { format } = useNFT3()
  const { formik, onAvatarChange } = useForm(profile)

  if (!ready) return null
  return (
    <ROOT onSubmit={formik.handleSubmit}>
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
                        <input hidden accept="image/*" type="file" onChange={onAvatarChange} />
                        <PhotoCamera />
                      </IconButton>
                    }
                  >
                    <Avatar alt={formik.values.name} src={format(formik.values.avatar)} />
                  </Badge>
                </FlexRowAlign>
                <Paragraph>{profile.name}</Paragraph>
                <Paragraph>Joined {formatData(formik.values.createdAt * 1000 || 0, 'MM yyyy')}</Paragraph>
              </Stack>
            </FlexRowAlign>

            <Stack spacing={2}>
              <Paragraph>Connected wallets</Paragraph>
              <Wallets />
            </Stack>
            <Stack spacing={2}>
              <Paragraph>Twitter</Paragraph>
              <Twitter />
            </Stack>
            <Stack spacing={2}>
              <Paragraph>Bio</Paragraph>
              <FormControl variant="standard">
                <TextareaAutosize
                  minRows={3}
                  name="bio"
                  placeholder="Tell us about yourself"
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                />
                <FormHelperText error>{formik.touched.bio && formik.errors.bio}</FormHelperText>
              </FormControl>
            </Stack>
            <Stack spacing={2}>
              <Paragraph>Url</Paragraph>

              <TextField
                label="Url"
                variant="outlined"
                name="url"
                fullWidth
                placeholder="Add a link"
                value={formik.values.url}
                onChange={formik.handleChange}
                error={formik.touched.url && Boolean(formik.errors.url)}
                helperText={formik.touched.url && formik.errors.url}
              />
            </Stack>
          </Stack>
        </CardContent>
        <CardActions>
          <SubmitBotton size="large" variant="contained" isSubmitting={formik.isSubmitting}>
            Save
          </SubmitBotton>
        </CardActions>
      </Card>
    </ROOT>
  )
}

export default Profile
