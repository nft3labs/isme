import { useState } from 'react'
import Button from '@mui/material/Button'
import Input from '@mui/material/Input'
import FlexBetween from 'components/flexbox/FlexBetween'

import type { StepProps } from '../type'

type VerifyTwitterProps = StepProps & {
  verify: (link: string) => any
  reset: () => any
}
const VerifyTwitter: FC<VerifyTwitterProps> = (props) => {
  const { activeStep, value, verify, reset } = props
  const [loading, setLoading] = useState(false)
  const [link, setLink] = useState('')
  if (activeStep !== value) return null

  return (
    <FlexBetween gap={4}>
      <Button color="inherit" onClick={reset} sx={{ mr: 1 }}>
        Reset
      </Button>
      <Input placeholder="Tweet link" fullWidth value={link} onChange={(e) => setLink(e.target.value)} />
      <Button
        variant="contained"
        onClick={() => {
          setLoading(true)
          verify(link).finally(() => {
            setLoading(false)
          })
        }}
        disabled={!link || loading}
      >
        Verify
      </Button>
    </FlexBetween>
  )
}

export default VerifyTwitter
