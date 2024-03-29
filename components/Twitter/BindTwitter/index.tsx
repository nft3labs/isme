import { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Stepper, Step, StepLabel, Stack } from '@mui/material'
import { createToastifyPromise } from 'app/utils/promise/toastify'
import { useNFT3Social } from 'domains/data'
import Dialog from 'components/Dialog'

import InputTwitterAccount from './InputTwitterAccount'
import OpenTwitter from './OpenTwitter'
import VerifyTwitter from './VerifyTwitter'
import type { BindTwitterInfo } from './type'

const ROOT = styled(Stack)``

const steps = ['Enter twitter username', 'Make a tweet', 'Verify']

type BindTwitterProps = {
  visible: boolean
  close: () => void
}
const BindTwitter: FC<BindTwitterProps> = ({ visible, close }) => {
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

  const verify = (link: string) => {
    return createToastifyPromise(
      twitter.verify(account!, info!.msghash, link).then((verify) => {
        close()
        if (!verify.result) return Promise.reject('Twitter verify failed')
        return twitter
          .add({
            account: account!,
            type: 'twitter',
            proof: verify.proof,
            verifier_key: verify.verifier_key,
            msghash: info!.msghash
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
    <Dialog
      visible={visible}
      onClose={() => {
        close()
        reset()
      }}
      title="Bind Twitter"
    >
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
    </Dialog>
  )
}

export default BindTwitter
