import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import type { FollowMember } from './types'

import FollowCard from './FollowCard'

const ROOT = styled(Stack)``

type FollowProps = {
  followers: FollowMember[]
  name: string
}
const Follow: FC<FollowProps> = ({ followers, name }) => {
  if (!followers.length) {
    return <div>{`No ${name} yet.`}</div>
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
