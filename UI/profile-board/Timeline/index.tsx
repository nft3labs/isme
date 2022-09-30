import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { useNFT3Assets } from 'domains/data'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

import TimelineCard from './TimelineCard'

const ROOT = styled(Stack)``

const Timeline: FC = () => {
  const {
    timeline: { data, loading, isEnd, loadMoreData },
    loading: baseLoading,
  } = useNFT3Assets()
  if (baseLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <CircularProgress />
      </Box>
    )
  }
  return (
    <ROOT spacing={2}>
      {data.map((info, index) => {
        return <TimelineCard key={index} {...info} />
      })}
      <Box justifyContent="center" display="flex">
        {isEnd ? (
          <Button size="small" disabled>
            No more data
          </Button>
        ) : (
          <Button size="small" disabled={loading} onClick={loadMoreData}>
            Load More
          </Button>
        )}
      </Box>
    </ROOT>
  )
}

export default Timeline
