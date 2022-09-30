import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import type { FollowMember } from './types'

import FollowCard from './FollowCard'

const ROOT = styled(Box)``

type FollowProps = {
  followers: FollowMember[]
}
const FollowGrid: FC<FollowProps> = ({ followers }) => {
  return (
    <ROOT>
      <Grid container spacing={2}>
        {followers.map((member, index) => {
          return (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <FollowCard {...member} />
            </Grid>
          )
        })}
      </Grid>
    </ROOT>
  )
}

export default FollowGrid
