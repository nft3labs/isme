import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import { useNFT3Assets } from 'domains/data'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

import TimelineCard from './TimelineCard'

const ROOT = styled(Stack)``

const Timeline: FC = () => {
  const { timeline, loading } = useNFT3Assets()
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <CircularProgress />
      </Box>
    )
  }
  return (
    <ROOT spacing={2}>
      {timeline.map((info, index) => {
        return <TimelineCard key={index} {...info} />
      })}
    </ROOT>
  )
}

export default Timeline
