import { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Stepper, Step, StepLabel } from '@mui/material'
import { createToastifyPromise } from 'app/utils/promise/toastify'
import type { BindTwitterInfo } from './type'
import { useNFT3Social } from 'domains/data'

import InputTwitterAccount from './InputTwitterAccount'
import OpenTwitter from './OpenTwitter'
import VerifyTwitter from './VerifyTwitter'

const ROOT = styled(Box)``

const steps = ['Input twitter account', 'Open twitter', 'Verify']

const BindTwitter: FC = () => {
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

  return (
    <ROOT sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
      <InputTwitterAccount {...{ activeStep, onNext, onBack, value: 0, setAccount, setInfo }} />
      <OpenTwitter {...{ activeStep, onNext, onBack, value: 1, info, verify }} />
      <VerifyTwitter {...{ activeStep, value: 2 }} />
    </ROOT>
  )
}

export default BindTwitter
