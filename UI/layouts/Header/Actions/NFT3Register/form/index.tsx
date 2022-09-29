import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Image from 'next/image'

import SubmitBotton from 'components/form/SubmitBotton'
import { H5, Paragraph, Tiny } from 'components/Typography'
import ETHImg from 'public/eth.svg'
import { textCenterEllipsis } from 'app/utils/string/text-center-ellipsis'

import { useForm } from './useForm'

const Form = (): JSX.Element => {
  const { formik, account } = useForm()

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={3}>
        <Stack spacing={2}>
          <H5>Connect wallet</H5>
          <Stack spacing={1} direction="row">
            <Image src={ETHImg} alt="ETH" />
            <Paragraph lineHeight="24px">{textCenterEllipsis(account)}</Paragraph>
            <Tiny color="#666" lineHeight="24px">
              (Current)
            </Tiny>
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
                  <Tiny color="#666">.isme</Tiny>
                </InputAdornment>
              ),
            }}
            value={formik.values.didname}
            onChange={formik.handleChange}
            error={formik.touched.didname && Boolean(formik.errors.didname)}
            helperText={formik.touched.didname && formik.errors.didname}
          />
        </Stack>
        <SubmitBotton size="large" variant="contained" isSubmitting={formik.isSubmitting}>
          Create account
        </SubmitBotton>
      </Stack>
    </form>
  )
}

export default Form
