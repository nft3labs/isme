import { useState } from 'react'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useNFT3Follow } from 'domains/data'
import { safeGet } from 'app/utils/get'
import Follow from 'components/Follow'

import ProfileInfo from './ProfileInfo'
import Board from './Board'
import Timeline from './Timeline'

const ROOT = styled(Stack)``

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props

  if (value != index) return null

  return <>{children}</>
}

const ProfileBoard: FC = () => {
  const follow = useNFT3Follow()
  const [value, setValue] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <ROOT spacing={2}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ProfileInfo />
        </Grid>
        <Grid item xs={8}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab label="Board" {...a11yProps(0)} />
              <Tab label="Timeline" {...a11yProps(1)} />
              <Tab label="Following" {...a11yProps(2)} />
              <Tab label="Followers" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Board />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Timeline />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Follow followers={safeGet(() => follow.following) || []} />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Follow followers={safeGet(() => follow.followers) || []} />
          </TabPanel>
        </Grid>
      </Grid>
    </ROOT>
  )
}

export default ProfileBoard
