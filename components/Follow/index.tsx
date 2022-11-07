import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import FollowCard from './FollowCard'
import { useMemo } from 'react'
import { useNFT3Follow } from 'domains/data'
import Button from '@mui/material/Button'

const ROOT = styled(Stack)``

type FollowProps = {
  name: string
}
const Follow: FC<FollowProps> = ({ name }) => {
  const follow = useNFT3Follow()
  const { followers, isEnd, loading, loadMoreData } = useMemo(() => {
    if (name === 'followers') {
      return {
        followers: follow.followers,
        isEnd: follow.isFollowersEnd,
        loading: follow.followersLoading,
        loadMoreData: follow.loadMoreFollowersData,
      }
    } else {
      return {
        followers: follow.following,
        isEnd: follow.isFollowingEnd,
        loading: follow.followingLoading,
        loadMoreData: follow.loadMoreFollowingData,
      }
    }
  }, [
    follow.followers,
    follow.followersLoading,
    follow.following,
    follow.followingLoading,
    follow.isFollowersEnd,
    follow.isFollowingEnd,
    follow.loadMoreFollowersData,
    follow.loadMoreFollowingData,
    name,
  ])
  if (!followers.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <Typography color="text.disabled">{`No ${name} yet.`}</Typography>
      </Box>
    )
  }
  return (
    <ROOT spacing={2}>
      {followers.map((member, index) => {
        return <FollowCard key={index} {...member} />
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

export default Follow
