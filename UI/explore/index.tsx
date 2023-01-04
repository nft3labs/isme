import { styled } from '@mui/material/styles'
import dynamic from 'next/dynamic'
import Stack from '@mui/material/Stack'
import { H1, H3 } from 'components/Typography'
import FollowGrid from 'components/Follow/FollowGrid'
import { useNFT3FeaturedPeoples } from 'domains/data'
import Button from '@mui/material/Button'

const ROOT = styled(Stack)``
const FollowGridDynamic = dynamic(async () => FollowGrid, { ssr: false })

const Explore: FC = () => {
  const { featuredPeoples, isEnd, loading, loadMoreData } = useNFT3FeaturedPeoples()

  return (
    <ROOT spacing={{ xs: 4, sm: 6 }}>
      <Stack spacing={2} marginTop={{ xs: 2, sm: 8 }}>
        <H1>Find people in the Web3 world.</H1>
        <H3 sx={{ color: 'text.secondary' }}>Connect with key opinion leaders in the ISME network.</H3>
      </Stack>
      <Stack spacing={2}>
        <FollowGridDynamic followers={featuredPeoples} />
        {isEnd ? (
          <Button size="small" disabled>
            No more data
          </Button>
        ) : (
          <Button size="small" disabled={loading} onClick={loadMoreData}>
            Load More
          </Button>
        )}
      </Stack>
    </ROOT>
  )
}

export default Explore
