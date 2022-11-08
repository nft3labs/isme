import { styled } from '@mui/material/styles'
import dynamic from 'next/dynamic'
import Stack from '@mui/material/Stack'
import { H1, H2, H3 } from 'components/Typography'
import FollowGrid from 'components/Follow/FollowGrid'
import { useNFT3FeaturedPeoples } from 'domains/data'
import Button from '@mui/material/Button'

const ROOT = styled(Stack)``
const FollowGridDynamic = dynamic(async () => FollowGrid, { ssr: false })

const Explore: FC = () => {
  const { featuredPeoples } = useNFT3FeaturedPeoples()
  const isEnd = false
  const loading = false
  const loadMoreData = () => {}

  return (
    <ROOT spacing={{ xs: 8, sm: 2 }}>
      <Stack spacing={2}>
        <H1>Your Decentralized Identity for Web 3.0</H1>
        <H3 sx={{ color: 'text.secondary' }}>Connect everything in the first unified social identity network</H3>
      </Stack>
      <Stack spacing={4}>
        <H2 textAlign="center">Featured People</H2>
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
      </Stack>
    </ROOT>
  )
}

export default Explore
