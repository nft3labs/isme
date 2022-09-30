import { useState } from 'react'
import Button from '@mui/material/Button'
import FlexBetween from 'components/flexbox/FlexBetween'

import type { StepProps } from '../type'

type VerifyTwitterProps = StepProps & {
  verify: () => any
  reset: () => any
}
const VerifyTwitter: FC<VerifyTwitterProps> = (props) => {
  const { activeStep, value, verify, reset } = props
  const [loading, setLoading] = useState(false)
  if (activeStep !== value) return null
  return (
    <FlexBetween>
      <Button color="inherit" onClick={reset} sx={{ mr: 1 }}>
        Reset
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          setLoading(true)
          verify().finally(() => {
            setLoading(false)
          })
        }}
        disabled={loading}
      >
        Verify
      </Button>
    </FlexBetween>
  )
}

export default VerifyTwitter
