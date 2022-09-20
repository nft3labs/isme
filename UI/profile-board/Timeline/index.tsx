import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import { useNFT3Assets } from 'domains/data'

import TimelineCard from './TimelineCard'

const ROOT = styled(Stack)``

const Timeline: FC = () => {
  const { txs } = useNFT3Assets()
  return (
    <ROOT spacing={2}>
      {txs.map((info, index) => {
        return <TimelineCard key={index} {...info} />
      })}
    </ROOT>
  )
}

export default Timeline
