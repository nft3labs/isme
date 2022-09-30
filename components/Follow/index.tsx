import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import type { FollowMember } from './types'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import FollowCard from './FollowCard'

const ROOT = styled(Stack)``

type FollowProps = {
  followers: FollowMember[]
  name: string
}
const Follow: FC<FollowProps> = ({ followers, name }) => {
  if (!followers.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <Typography color='text.disabled'>{`No ${name} yet.`}</Typography>
      </Box>
    )
  }
  return (
    <ROOT spacing={2}>
      {followers.map((member, index) => {
        return <FollowCard key={index} {...member} />
      })}
    </ROOT>
  )
}

export default Follow
