import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import type { FollowMember } from './types'

import FolloweCard from './FolloweCard'

const ROOT = styled(Stack)``

type FollowProps = {
  followers: FollowMember[]
}
const Follow: FC<FollowProps> = ({ followers }) => {
  return (
    <ROOT spacing={2}>
      {followers.map((member, index) => {
        return <FolloweCard key={index} {...member} />
      })}
    </ROOT>
  )
}

export default Follow
