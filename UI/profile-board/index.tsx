import { useMemo } from 'react'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewTimelineRoundedIcon from '@mui/icons-material/ViewTimelineRounded'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import RssFeedRoundedIcon from '@mui/icons-material/RssFeedRounded'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

import { useNFT3Profile } from 'domains/data'
import Follow from 'components/Follow'

import ProfileInfo from './ProfileInfo'
import Board from './Board'
import Timeline from './Timeline'
import type { TabsProps } from './Tabs'
import Tabs from './Tabs'
import Feed from './Feed'

const ROOT = styled(Stack)``

const ProfileBoard: FC = () => {
  const { ready, didinfo } = useNFT3Profile()
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
            name: 'following',
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
            name: 'followers',
          },
        },
      },
      {
        title: {
          label: 'Feed',
          icon: <RssFeedRoundedIcon />,
        },
        children: {
          component: Feed,
        },
      },
    ]
    return returnValue
  }, [])

  if (!ready) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    )
  } else if (!didinfo) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <Typography color="text.disabled" variant="h6">
          This user doesn't exist.
        </Typography>
      </Box>
    )
  }

  return (
    <ROOT spacing={2} marginTop={4}>
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
