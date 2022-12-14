import type { StepProps } from '../type'
import FlexBetween from 'components/flexbox/FlexBetween'
import Button from '@mui/material/Button'

type StepActionsProps = StepProps & {
  title: string
  disabled?: boolean
}

const StepActions: FC<StepActionsProps> = ({ onNext, onBack, activeStep, title, disabled }) => {
  return (
    <FlexBetween>
      {onBack && (
        <Button color="inherit" disabled={activeStep === 0} onClick={onBack} sx={{ mr: 1 }}>
          Back
        </Button>
      )}
      {onNext && (
        <Button variant="contained" disabled={disabled} onClick={onNext}>
          {title}
        </Button>
      )}
    </FlexBetween>
  )
}

export default StepActions
