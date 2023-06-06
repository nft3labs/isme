import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Image from 'next/image'

import SubmitBotton from 'components/form/SubmitBotton'
import { H5, Paragraph, Tiny } from 'components/Typography'
import ETHImg from 'public/eth.svg'
import { textCenterEllipsis } from 'app/utils/string/text-center-ellipsis'

import { useForm } from './useForm'

const Form = (): JSX.Element => {
  const { formik, account, ens } = useForm()

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={3}>
        <Stack spacing={2}>
          <H5>Connect wallet</H5>
          <Stack spacing={1} direction="row">
            <Image src={ETHImg} alt="ETH" width={16} height={16} />
            <Paragraph lineHeight="24px">{textCenterEllipsis(account)}</Paragraph>
            {ens && (
              <Tiny color="text.secondary" lineHeight="24px">
                ({ens.ensName})
              </Tiny>
            )}
          </Stack>
        </Stack>
        <Stack spacing={2}>
          <H5>Enter your DID name</H5>
          <TextField
            variant="outlined"
            name="didname"
            fullWidth
            placeholder="DID name"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tiny color="text.secondary">.isme</Tiny>
                </InputAdornment>
              ),
            }}
            value={formik.values.didname}
            onChange={formik.handleChange}
            error={formik.touched.didname && Boolean(formik.errors.didname)}
            helperText={formik.touched.didname && formik.errors.didname}
          />
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
        <SubmitBotton size="large" variant="gradient" isSubmitting={formik.isSubmitting}>
          Create Account
        </SubmitBotton>
      </Stack>
    </form>
  )
}

export default Form
