import type { StepProps } from '../type'

const VerifyTwitter: FC<StepProps> = (props) => {
  const { activeStep, value } = props
  if (activeStep !== value) return null
  return <p>loading</p>
}

export default VerifyTwitter
