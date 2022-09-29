import { useNumberFormat } from 'app/utils/number/hooks'
import { Fragment } from 'react'

type NumberProps = {
  value: any
}
export const DisplayUSD: FC<NumberProps> = ({ value }) => {
  const NF = useNumberFormat()
  return <Fragment>{NF.format(value, NF.getOptions('USD')) || '-'}</Fragment>
}
export const DisplayNumber: FC<NumberProps> = ({ value }) => {
  const NF = useNumberFormat()
  return <Fragment>{NF.format(value, NF.getOptions('number')) || '-'}</Fragment>
}
