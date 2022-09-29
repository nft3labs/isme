import type { BindTwitterInfo, StepProps } from '../type'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useNFT3Social } from 'domains/data'
import StepActions from '../StepActions'

type InputTwitterAccountProps = StepProps & {
  account: string
  setAccount: (account: string) => void
  setInfo: (info: BindTwitterInfo) => void
}
const InputTwitterAccount: FC<InputTwitterAccountProps> = (props) => {
  const { setAccount, setInfo, onNext, activeStep, value, account } = props
  const { twitter } = useNFT3Social()
  if (activeStep !== value) return null
  return (
    <Stack spacing={2}>
      <TextField
        label="Twitter Account"
        value={account}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          setAccount(event.target.value)
        }}
      />
      <StepActions
        {...{
          ...props,
          title: 'Next',
          disabled: !account,
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
