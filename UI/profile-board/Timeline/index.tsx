import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import { useProfileBoard } from 'domains/data'

import TimelineCard from './TimelineCard'

const ROOT = styled(Stack)``

const Timeline: FC = () => {
  const { ready, info } = useProfileBoard()
  if (!ready || !info) return null
  const { txs } = info
  return (
    <ROOT spacing={2}>
      {txs.map((info, index) => {
        return <TimelineCard key={index} {...info} />
      })}
    </ROOT>
  )
}

export default Timeline
