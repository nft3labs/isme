import type { FC } from 'react'
import { useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

import { selectPageProgress } from 'store/progress/page'
import { PROGRESS_STATUS } from './helpers'

const ROOT = styled(Box)`
  width: 100%;
  position: absolute;
  top: 0;
`

const NProgress: FC = () => {
  const { value, status } = useSelector(selectPageProgress) || {}
  if (status === PROGRESS_STATUS.ready) return null
  return (
    <ROOT>
      <LinearProgress variant="determinate" value={value} />
    </ROOT>
  )
}

export default NProgress
