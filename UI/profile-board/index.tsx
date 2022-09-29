import { useMemo } from 'react'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import { useNFT3Follow } from 'domains/data'
import { safeGet } from 'app/utils/get'
import Follow from 'components/Follow'

import ProfileInfo from './ProfileInfo'
import Board from './Board'
import Timeline from './Timeline'
import Tabs from './Tabs'
import type { TabsProps } from './Tabs'

const ROOT = styled(Stack)``

const ProfileBoard: FC = () => {
  const follow = useNFT3Follow()
  const tabs = useMemo(() => {
    const returnValue: TabsProps['tabs'] = [
      {
        title: {
          label: 'Board',
          icon: <GridViewRoundedIcon />,
        },
        children: {
          component: Board,
        },
      },
      {
        title: {
          label: 'Timeline',
          icon: <GridViewRoundedIcon />,
        },
        children: {
          component: Timeline,
        },
      },
      {
        title: {
          label: 'Following',
          icon: <GridViewRoundedIcon />,
        },
        children: {
          component: Follow,
          props: {
            followers: safeGet(() => follow.following) || [],
          },
        },
      },
      {
        title: {
          label: 'Followers',
          icon: <GridViewRoundedIcon />,
        },
        children: {
          component: Follow,
          props: {
            followers: safeGet(() => follow.followers) || [],
          },
        },
      },
    ]
    return returnValue
  }, [follow.followers, follow.following])

  return (
    <ROOT spacing={2}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ProfileInfo />
        </Grid>
        <Grid item xs={8}>
          <Tabs tabs={tabs} />
        </Grid>
      </Grid>
    </ROOT>
  )
}

export default ProfileBoard
