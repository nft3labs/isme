import { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Stepper, Step, StepLabel, Button, Stack, Box } from '@mui/material'
import { createToastifyPromise } from 'app/utils/promise/toastify'
import type { BindTwitterInfo } from './type'
import { useNFT3Social } from 'domains/data'

import InputTwitterAccount from './InputTwitterAccount'
import OpenTwitter from './OpenTwitter'
import VerifyTwitter from './VerifyTwitter'
import { useDialog } from 'app/hooks/useDialog'
import { Paragraph } from 'components/Typography'

const ROOT = styled(Stack)``

const steps = ['Input twitter account', 'Open twitter', 'Verify']

const BindTwitter: FC = () => {
  const { visible, open } = useDialog()
  const [activeStep, setActiveStep] = useState(0)
  const [account, setAccount] = useState('')
  const { twitter, update } = useNFT3Social()
  const [info, setInfo] = useState<BindTwitterInfo>()

  const onNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const onBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const reset = () => {
    setActiveStep(0)
  }

  const verify = () => {
    return createToastifyPromise(
      twitter.verify(account!, info!.msghash).then((verify) => {
        if (!verify.result) return Promise.reject()
        return twitter
          .add({
            account: account!,
            type: 'twitter',
            proof: verify.proof,
            verifier_key: verify.verifier_key,
            msghash: info!.msghash,
          })
          .then(() => {
            setInfo(undefined)
            update()
          })
      })
    ).catch(() => {
      setActiveStep(0)
    })
  }

  if (!visible) {
    return (
      <ROOT sx={{ width: '100%' }} spacing={2}>
        <Paragraph sx={{ color: 'text.secondary' }}>Twitter not yet linked</Paragraph>
        <Box>
          <Button variant="outlined" onClick={open} sx={{ width: { xs: 1, sm: 'auto'} }}>
            Verify
          </Button>
        </Box>
      </ROOT>
    )
  }

  return (
    <ROOT sx={{ width: '100%' }} spacing={4}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
      <InputTwitterAccount {...{ activeStep, onNext, onBack, value: 0, setAccount, setInfo, account }} />
      <OpenTwitter {...{ activeStep, onNext, onBack, value: 1, info }} />
      <VerifyTwitter {...{ activeStep, value: 2, verify, reset }} />
    </ROOT>
  )
}

export default BindTwitter
