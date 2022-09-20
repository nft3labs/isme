import type { BindTwitterInfo, StepProps } from '../type'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import StepActions from '../StepActions'

type OpenTwitterProps = StepProps & {
  info: BindTwitterInfo
  verify: () => any
}
const OpenTwitter: FC<OpenTwitterProps> = (props) => {
  const { info, verify, onNext, activeStep, value } = props
  if (activeStep !== value) return null
  return (
    <Stack spacing={2}>
      <Button onClick={() => window.open(info.link)} disabled={!info}>
        Open
      </Button>
      <StepActions
        {...{
          ...props,
          title: 'Next',
          onNext: () => {
            verify()
            onNext()
          },
        }}
      />
    </Stack>
  )
}

export default OpenTwitter
