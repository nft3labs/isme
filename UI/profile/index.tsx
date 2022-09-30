import { useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { format as formatData } from 'date-fns'

import { useNFT3, useNFT3Profile, useUser } from 'domains/data'
import { Paragraph, H2, H5 } from 'components/Typography'
import FlexRowAlign from 'components/flexbox/FlexRowAlign'

import Twitter from './Twitter'
import Wallets from './Wallets'
import SubmitBotton from 'components/form/SubmitBotton'
import { useForm } from './useForm'

const ROOT = styled('form')`
  padding-top: 30px;
`

const Profile: FC = () => {
  const theme = useTheme()
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
      <Card
        sx={{
          padding: { xs: theme.spacing(2), sm: theme.spacing(4)},
          '.MuiCardContent-root': {
          },
          '.MuiCardActions-root': {
            // padding: '0 50px 50px 50px',
            justifyContent: 'flex-end',
          },
        }}
      >
        <CardContent>
          <Stack spacing={4}>
            <FlexRowAlign>
              <Stack spacing={2}>
                <FlexRowAlign>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Button
                        sx={{
                          width: 32,
                          minWidth: 0,
                          height: 32,
                          borderRadius: '100%',
                          padding: 0,
                          background: '#fff',
                          color: theme.palette.text.primary,
                          boxShadow: theme.shadows[3],
                          '&:hover': {
                            backgroundColor: theme.palette.grey[200],
                          }
                        }}
                        variant="text"
                        aria-label="upload picture"
                        component="label"
                      >
                        <input hidden accept="image/*" type="file" onChange={onAvatarChange} />
                        <EditRoundedIcon
                          sx={{
                            width: 18,
                            height: 18,
                          }}
                        />
                      </Button>
                    }
                  >
                    <Avatar
                      alt={formik.values.name}
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '30px',
                      }}
                      src={format(formik.values.avatar)}
                    />
                  </Badge>
                </FlexRowAlign>
                <Stack spacing={1} textAlign="center">
                  <H2>{`${profile.name}.isme`}</H2>
                  <Paragraph sx={{ color: 'text.secondary' }}>
                    Joined {formatData(formik.values.createdAt * 1000 || 0, 'MM yyyy')}
                  </Paragraph>
                </Stack>
              </Stack>
            </FlexRowAlign>

            <Stack spacing={2}>
              <H5>Connected wallets</H5>
              <Wallets />
            </Stack>
            <Stack spacing={2}>
              <H5>Twitter</H5>
              <Twitter />
            </Stack>
            <Stack spacing={2}>
              <H5>Bio</H5>
              <FormControl variant="standard">
                <TextField
                  name="bio"
                  placeholder="Tell us about yourself"
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  rows={3}
                  multiline
                />
                <FormHelperText error>{formik.touched.bio && formik.errors.bio}</FormHelperText>
              </FormControl>
            </Stack>
            <Stack spacing={2}>
              <H5>Url</H5>

              <TextField
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
          <SubmitBotton sx={{ width: { xs: 1, sm: 'auto'} }} size="large" variant="outlined" isSubmitting={formik.isSubmitting}>
            Save
          </SubmitBotton>
        </CardActions>
      </Card>
    </ROOT>
  )
}

export default Profile
