export type BindTwitterInfo = {
  link: string
  text: string
  msghash: string
}

export type StepProps = {
  activeStep: number
  onNext?: () => void
  onBack?: () => void
  value: number
}
