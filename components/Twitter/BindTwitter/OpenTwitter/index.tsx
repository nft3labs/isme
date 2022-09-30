import type { BindTwitterInfo, StepProps } from '../type'
import Stack from '@mui/material/Stack'
import StepActions from '../StepActions'

type OpenTwitterProps = StepProps & {
  info: BindTwitterInfo
}
const OpenTwitter: FC<OpenTwitterProps> = (props) => {
  const { info, onNext, activeStep, value } = props
  if (activeStep !== value) return null
  return (
    <Stack spacing={2}>
      <StepActions
        {...{
          ...props,
          title: 'Make a tweet',
          disabled: !info,
          onNext: () => {
            window.open(info.link)
            onNext()
          },
        }}
      />
    </Stack>
  )
}

export default OpenTwitter
