import type { BindTwitterInfo, StepProps } from '../type'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useNFT3Social } from 'domains/data'
import StepActions from '../StepActions'

type InputTwitterAccountProps = StepProps & {
  setAccount: (account: string) => void
  setInfo: (info: BindTwitterInfo) => void
}
const InputTwitterAccount: FC<InputTwitterAccountProps> = (props) => {
  const { setAccount, setInfo, onNext, activeStep, value } = props
  const { twitter } = useNFT3Social()
  if (activeStep !== value) return null
  return (
    <Stack spacing={2}>
      <TextField
        label="Twitter Account"
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          setAccount(event.target.value)
        }}
      />
      <StepActions
        {...{
          ...props,
          title: 'Next',
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
