import { useMemo } from 'react'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewTimelineRoundedIcon from '@mui/icons-material/ViewTimelineRounded'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'

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
          icon: <ViewTimelineRoundedIcon />,
        },
        children: {
          component: Timeline,
        },
      },
      {
        title: {
          label: 'Following',
          icon: <PersonRoundedIcon />,
        },
        children: {
          component: Follow,
          props: {
            followers: safeGet(() => follow.following) || [],
            name: 'following'
          },
        },
      },
      {
        title: {
          label: 'Followers',
          icon: <GroupRoundedIcon />,
        },
        children: {
          component: Follow,
          props: {
            followers: safeGet(() => follow.followers) || [],
            name: 'followers'
          },
        },
      },
    ]
    return returnValue
  }, [follow.followers, follow.following])

  return (
    <ROOT spacing={2}>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <ProfileInfo />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Tabs tabs={tabs} />
        </Grid>
      </Grid>
    </ROOT>
  )
}

export default ProfileBoard
