import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'

import SubmitBotton from 'components/form/SubmitBotton'
import { useForm } from './useForm'
import FlexRowAlign from 'components/flexbox/FlexRowAlign'

const Form = (): JSX.Element => {
  const { formik, account } = useForm()

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2" sx={{ marginBottom: 2 }}>
            Connect wallet
          </Typography>
          <TextField label="First name *" variant="outlined" name="first_name" fullWidth value={account} />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ marginBottom: 2 }}>
            Enter your DID name
          </Typography>
          <TextField
            label="DID name *"
            variant="outlined"
            name="didname"
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="end">.isme</InputAdornment>,
            }}
            value={formik.values.didname}
            onChange={formik.handleChange}
            error={formik.touched.didname && Boolean(formik.errors.didname)}
            helperText={formik.touched.didname && formik.errors.didname}
          />
        </Box>
        <FlexRowAlign>
          <SubmitBotton size="large" variant="contained" isSubmitting={formik.isSubmitting}>
            Create account
          </SubmitBotton>
        </FlexRowAlign>
      </Stack>
    </form>
  )
}

export default Form
