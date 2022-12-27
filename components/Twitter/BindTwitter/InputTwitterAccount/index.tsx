import type { BindTwitterInfo, StepProps } from '../type'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useNFT3Social } from 'domains/data'
import StepActions from '../StepActions'
import InputAdornment from '@mui/material/InputAdornment'
import { useState } from 'react'

function validTwitteAccount(account: string) {
  return /^[a-zA-Z0-9_]{1,15}$/.test(account)
}

type InputTwitterAccountProps = StepProps & {
  account: string
  setAccount: (account: string) => void
  setInfo: (info: BindTwitterInfo) => void
}
const InputTwitterAccount: FC<InputTwitterAccountProps> = (props) => {
  const { setAccount, setInfo, onNext, activeStep, value, account } = props
  const { twitter } = useNFT3Social()
  const [errorText, setErrorText] = useState('')
  if (activeStep !== value) return null
  return (
    <Stack spacing={2}>
      <TextField
        label="Twitter Username"
        value={account}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          const twitteAccount = event.target.value
          setAccount(twitteAccount)
          if (twitteAccount) {
            setErrorText(validTwitteAccount(twitteAccount) ? '' : 'Invalid twitter account.')
          }
        }}
        error={!!errorText}
        helperText={errorText}
        InputProps={{
          startAdornment: <InputAdornment position="start">https://twitter.com/</InputAdornment>,
        }}
        placeholder='username'
      />
      <StepActions
        {...{
          ...props,
          title: 'Next',
          disabled: !account || !!errorText,
          onNext: () => {
            setInfo(twitter.request())
            onNext()
          },
        }}
      />
    </Stack>
  )
}

export default InputTwitterAccount
